var modules = {};

(function(exports) {

  function treeSVG(data) {
    var width = 500,
      height = 500;

    var cluster = d3.layout.cluster()
          .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

    var svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append("g")
      .attr("transform", "translate(40,40)");
    

    var nodes = cluster.nodes(data);
    var links = cluster.links(nodes);
    var color = d3.scale.category20();
   
    var link = svg.selectAll("path")
      .data(links)
      .enter().append("path")
      .attr('class', 'link')
      .attr("d", diagonal);

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    node.append('circle')
        .attr('r', 10)
        .transition()
        .attr('fill', function(d) {
          return color(d.name);
        });

    node.append('text')
        .attr('dx', function (d) { return d.children ? -8 : 8; })
        .attr('dy', 3)
        .style('text-anchor', function(d) { return d.children ? 'end' : 'start'})
        .text(function(d) { return d.name; });

  }

  function clean() {
    d3.selectAll('svg').remove();
  }

  exports.tree = function(data) {
    clean();
    treeSVG(data);
  };
})(modules);


(function(exports) {

  var editor = ace.edit('editor');
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  exports.editor = editor;

})(modules);

(function(exports) {

  function isChildrenOf(sub, parent) {
    return Object.getPrototypeOf(sub.prototype).constructor === parent;
  }

  function generateTree(str) {
    var root = {
      name: 'Object',
      children: []
    }
    var Animal, Dog;

    try {
      eval(str);
      
      if (Animal && isChildrenOf(Animal, Object)) {        
        root.children.push({name: 'Animal', children: []});
      }

      if (Dog && isChildrenOf(Dog, Object)) {
        root.children.push({name: 'Dog', children: []});
      }
      
      if (Dog && Animal && isChildrenOf(Dog, Animal)) {
        root.children[0].children.push({name: 'Dog', children: []});
      }
    }
    catch(e) {
      console.error(e);
    }
    finally {
      return root;
    }
  }

  exports.generate = generateTree;
})(modules);

(function run(exports) {
  var editor = modules.editor;
  var generator = modules.generate;
  editor.getSession().on('change', handleEditorChange);

  function handleEditorChange() {
    var root = generator(
      editor.getValue()
    )
    console.log(root);

    modules.tree(root);
  }
})(modules);


