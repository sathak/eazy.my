var OrgChart = function (element, config) {
  var that = this;
  this.element = element;    
  this.config = {
      lazyLoading: true,
      enableDragDrop: false,
      enableSearch: true,
      enableTouch: false,
      miniMap: false,
      nodeMenu: null,
      nodeContextMenu: null,
      menu: null,
      toolbar: false,
      sticky: true,
      nodeMouseClick: OrgChart.action.details,
      nodeMouseDbClick: OrgChart.none,
      mouseScrool: OrgChart.action.zoom, 
      showXScroll: OrgChart.none,
      showYScroll: OrgChart.none,
      template: "ana",
      tags: {},
      min: false,
      nodeBinding: {}, 
      linkBinding: {},
      searchFields: [],
      searchDisplayField: null,
      searchFieldsWeight: null,
      nodes: [],
      clinks: [],
      slinks: [],
      levelSeparation: 60,
      siblingSeparation: 20,
      subtreeSeparation: 40,
      mixedHierarchyNodesSeparation: 15,
      assistantSeparation: 100,
      minPartnerSeparation: 50,
      partnerChildrenSplitSeparation: 20,
      partnerNodeSeparation: 15,
      columns: 10,
      padding: 30,
      orientation: OrgChart.orientation.top,
      layout: OrgChart.normal,
      scaleInitial: 1,
      scaleMin: 0.1,
      scaleMax: 5,
      orderBy: null,
      editUI: null,
      searchUI: null,
      xScrollUI: null,
      yScrollUI: null,
      nodeMenuUI: null,
      nodeContextMenuUI: null,
      toolbarUI: null,
      notifierUI: null,
      menuUI: null,
      exportUrl: "",
      collapse: {},
      expand: {},
      align: OrgChart.CENTER,
      UI: null,
      anim: {
          func: OrgChart.anim.outPow,
          duration: 200
      },
      zoom: {
          speed: 120,
          smooth: 12
      },
      roots: null,
      state: null
  };

  if (config) {
      for (var n in this.config) {
          if (typeof config[n] === "object" && !Array.isArray(config[n])) {
              this.config[n] = OrgChart._mergeObject(this.config[n], config[n]);
          }
          else if (typeof config[n] !== "undefined") {
              this.config[n] = config[n];
          }
      }
  }    


  this._layoutConfigs = {
      base: {
          orientation: this.config.orientation,
          levelSeparation: this.config.levelSeparation,
          mixedHierarchyNodesSeparation: this.config.mixedHierarchyNodesSeparation,
          assistantSeparation: this.config.assistantSeparation,
          subtreeSeparation: this.config.subtreeSeparation,
          siblingSeparation: this.config.siblingSeparation,
          layout: this.config.layout,
          columns: this.config.columns,
          collapse: this.config.collapse,
          partnerNodeSeparation: this.config.partnerNodeSeparation
      }
  };

  if (this.config.tags){
      for(var tagName in this.config.tags){
          var tag = this.config.tags[tagName];
          if (tag.subTreeConfig != undefined){
                  this._layoutConfigs[tagName] = {
                      orientation: tag.subTreeConfig.orientation != undefined ? tag.subTreeConfig.orientation : this.config.orientation,
                      levelSeparation: tag.subTreeConfig.levelSeparation != undefined ? tag.subTreeConfig.levelSeparation : this.config.levelSeparation,
                      mixedHierarchyNodesSeparation: tag.subTreeConfig.mixedHierarchyNodesSeparation != undefined ? tag.subTreeConfig.mixedHierarchyNodesSeparation : this.config.mixedHierarchyNodesSeparation,
                      assistantSeparation: tag.subTreeConfig.assistantSeparation != undefined ? tag.subTreeConfig.assistantSeparation : this.config.assistantSeparation,
                      subtreeSeparation: tag.subTreeConfig.subtreeSeparation != undefined ? tag.subTreeConfig.subtreeSeparation : this.config.subtreeSeparation,
                      siblingSeparation: tag.subTreeConfig.siblingSeparation != undefined ? tag.subTreeConfig.siblingSeparation : this.config.siblingSeparation,
                      layout: tag.subTreeConfig.layout != undefined ? tag.subTreeConfig.layout : this.config.layout,
                      columns: tag.subTreeConfig.columns != undefined ? tag.subTreeConfig.columns : this.config.columns,
                      collapse: tag.subTreeConfig.collapse != undefined ? tag.subTreeConfig.collapse : this.config.collapse,
                      partnerNodeSeparation: tag.subTreeConfig.partnerNodeSeparation != undefined ? tag.subTreeConfig.partnerNodeSeparation : this.config.partnerNodeSeparation,
                  }
              }
      }
  }
  
  this._event_id = OrgChart._guid();


  if (!this.config.searchFields.length){
      if (this.config.nodeBinding){
          for(var name in this.config.nodeBinding){                
              if (name.indexOf('img')  == -1 && typeof(this.config.nodeBinding[name]) != 'function'){
                  this.config.searchFields.push(this.config.nodeBinding[name]);
              }
          }
      }
  }
  
  if (!OrgChart._validateConfig(this.config)) {
      return;
  }

  this.server = null;
  this._vScroll = {};

  if (!this.config.ui) {
      this.ui = OrgChart.ui;
  }

  if (!this.config.editUI) {
      this.editUI = new OrgChart.editUI();
  }
  else {
      this.editUI = this.config.editUI;
  }
  this.editUI.init(this);
  
  if (this.server === null) {
      this.server = new OrgChart.server(this.config, this._layoutConfigs);
  }

  if (!this.config.searchUI) {
      this.searchUI = new OrgChart.searchUI();
  }
  else {
      this.searchUI = this.config.searchUI;
  }
  this.searchUI.init(this);

  if (!this.config.nodeMenuUI) {
      this.nodeMenuUI = new OrgChart.menuUI();
  }
  else {
      this.nodeMenuUI = this.config.nodeMenuUI;
  }
  this.nodeMenuUI.init(this, this.config.nodeMenu);

  if (!this.config.nodeContextMenuUI) {
      this.nodeContextMenuUI = new OrgChart.menuUI();
  }
  else {
      this.nodeContextMenuUI = this.config.nodeContextMenuUI;
  }
  this.nodeContextMenuUI.init(this, this.config.nodeContextMenu);


  if (!this.config.toolbarUI) {
      this.toolbarUI = new OrgChart.toolbarUI();
  }
  else {
      this.toolbarUI = this.config.toolbarUI;
  }

  
  if (!this.config.notifierUI) {
      this.notifierUI = new OrgChart.notifierUI();
  }
  else {
      this.notifierUI = this.config.notifierUI;
  }
  this.notifierUI.init(this);


  if (!this.config.menuUI) {
      this.menuUI = new OrgChart.menuUI();
  }
  else {
      this.menuUI = this.config.menuUI;
  }
  this.menuUI.init(this, this.config.menu);

  if (!this.config.xScrollUI) {
      this.xScrollUI = new OrgChart.xScrollUI(this.element, this.config, function () {
          return {
              boundary: that.response.boundary,
              scale: that.getScale(),
              viewBox: that.getViewBox(),
              padding: that.config.padding
          }
      }, function (viewBox) {
              that.setViewBox(viewBox);
          }, function () {
              that._draw(true, OrgChart.action.xScroll);
          });
  }

  if (!this.config.yScrollUI) {
      this.yScrollUI = new OrgChart.yScrollUI(this.element, this.config, function () {
          return {
              boundary: that.response.boundary,
              scale: that.getScale(),
              viewBox: that.getViewBox(),
              padding: that.config.padding
          }
      }, function (viewBox) {
          that.setViewBox(viewBox);
      }, function () {
          that._draw(true, OrgChart.action.xScroll);
      });
  }

  this._gragStartedId = null;
  this._timeout = null;
  this._touch = null;
  this._initialized = false;
  this._moveInterval = null;
  this._movePosition = null;
  this.response = null;
  this.nodes = null;

  this._setInitialSizeIfNotSet();

  if (this.config.nodes.length > 0){
      this._draw(false, OrgChart.action.init);
  }
};

OrgChart.prototype.load = function(json){
  this.config.nodes = json;
  this._draw(false, OrgChart.action.init);
  return this;
};

OrgChart.prototype.loadXML = function (xml) {    
  var nodes = OrgChart._xml2json(xml);
  this.load(nodes);
};

OrgChart.prototype.getXML = function () {        
  return OrgChart._json2xml(this.config.nodes);
};

OrgChart.prototype.on = function(event, callback){
  OrgChart.events.on(event, callback, this._event_id);
  return this;
};

OrgChart.prototype.draw = function (action, actionParams, callback) {
  if (action == undefined) {
      action = OrgChart.action.update;
  }
  this._draw(false, action, actionParams, callback)
};


OrgChart.prototype._draw = function (readFromCache, action, actionParams, callback) {
  var that = this;
  this._hideBeforeAnimationCompleted = false;
  var vb = (action == OrgChart.action.init) ? null : this.getViewBox(); 
  this.server.read(readFromCache, this.width(), this.height(), vb, action, actionParams, function(response){  
      if (action != OrgChart.action.exporting){
          that.nodes = response.nodes;  
          that.visibleNodeIds = response.visibleNodeIds;  
          that.roots = response.roots;  
      }
      that.editUI.fields = response.allFields;
      var args = {
          defs: ''
      }
      OrgChart.events.publish('renderdefs', [that, args]);

      var content = that.ui.defs(args.defs);
      var newScale = that.getScale(response.viewBox);
      content += that.ui.pointer(that.config, action, newScale);   


      var prevViewBox = that.getViewBox();
      var viewBox = response.viewBox;

      // if (!that._initialized) {
      //     that.element.innerHTML = '<div id="bg-tests"></div>';
      // }
  
      var args = {content: content, res: response};
      OrgChart.events.publish('prerender', [that, args]);
      content = args.content;  

      for (var i = 0; i < response.visibleNodeIds.length; i++) {
          var node = response.nodes[response.visibleNodeIds[i]];
          var data = that._get(node.id);

          content += that.ui.node(node, data, response.animations, that.config, undefined, undefined, undefined, action, newScale, that);    
      }    

      for (var i = 0; i < response.visibleNodeIds.length; i++) {
          var node = response.nodes[response.visibleNodeIds[i]];
          var data = that._get(node.id);

          content += that.ui.link(node, that, newScale, response.bordersByRootIdAndLevel, response.nodes);
          content += that.ui.expandCollapseBtn(that, node, that._layoutConfigs, action, newScale);  
      }    



      var args = {content: content, res: response};
      OrgChart.events.publish('render', [that, args]);
      content = args.content;  
      
      content += that.ui.lonely(that.config);     
          
      if (action === OrgChart.action.exporting){
          var b = response.boundary;      
          var w = b.maxX - (b.minX);
          var h = b.maxY - (b.minY);
          var html = that.ui.svg(w, h, [b.minX, b.minY, w, h], that.config, content, newScale);
          callback(html);
          return;
      }
  
      if ((action === OrgChart.action.centerNode) || (action === OrgChart.action.insert) || (action === OrgChart.action.expand) || (action === OrgChart.action.collapse) || (action === OrgChart.action.update)){
          viewBox = prevViewBox;
      }
  
      if (action === OrgChart.action.init && prevViewBox != null) {
          viewBox = prevViewBox;
      }

      that.response = response;
  
      var html = that.ui.svg(that.width(), that.height(), viewBox, that.config, content);
  
      if (!that._initialized) {
          that.element.innerHTML = that.ui.css() + that.ui.exportMenuButton(that.config) + html;
          that._attachInitEventHandlers();
          that._attachEventHandlers();

          that.xScrollUI.create(that.width(), that.config.padding);
          that.xScrollUI.setPosition();
          that.xScrollUI.addListener(that.getSvg());         

          that.yScrollUI.create(that.height(), that.config.padding);
          that.yScrollUI.setPosition();
          that.yScrollUI.addListener(that.getSvg());

          if (that.config.enableSearch) {
              that.searchUI.addSearchControl();
          }            
          
          that.toolbarUI.init(that, that.config.toolbar);               
  
          // var div = document.createElement("div");
          // div.setAttribute("id", "bg-tests");
          // that.element.appendChild(div);
      }
      else {        
          var svg = that.getSvg();
          var parentNode = svg.parentNode;
          parentNode.removeChild(svg);        
          parentNode.insertAdjacentHTML("afterbegin", html);
  
          that._attachEventHandlers();
          that.xScrollUI.addListener(that.getSvg());        
          that.yScrollUI.addListener(that.getSvg());      
          that.xScrollUI.setPosition();
          that.yScrollUI.setPosition();
      }    
  
      var callbackCalled = false;
      
      that.notifierUI.show(response.notif);
  

      var anims = that.response.animations;
      if (anims[0].length > 0) {//should animation
          that._hideBeforeAnimation(anims[0].length);
          for (var i = 0; i < anims[0].length; i++) {
              anims[0][i] = that.getNodeElement(anims[0][i]);
          }
  
          OrgChart.anim(anims[0], anims[1], anims[2], that.config.anim.duration, that.config.anim.func, function () {
  
              if (!callbackCalled) {
                  if (callback) {
                      callback();
                  }                    
                  OrgChart.events.publish('redraw', [that]);
                  that._showAfterAnimation();
                  callbackCalled = true;
              }
          });
      }
      if (action === OrgChart.action.centerNode) {
          OrgChart.anim(that.getSvg(),
              { viewbox: prevViewBox },
              { viewbox: that.response.viewBox },
              that.config.anim.duration,
              that.config.anim.func, function () {
                  that.ripple(actionParams.options.rippleId);
                  if (!callbackCalled) {
                      if (callback) {
                          callback();
                      }                        
                      OrgChart.events.publish('redraw', [that]);
                      that._showAfterAnimation();
                      callbackCalled = true;
                  }
              }, function () {
                  that.xScrollUI.setPosition();
                  that.yScrollUI.setPosition();      
              });
      }
      else if (prevViewBox && that.response && (prevViewBox[0] != that.response.viewBox[0] || prevViewBox[1] != that.response.viewBox[1] || prevViewBox[2] != that.response.viewBox[2] || prevViewBox[3] != that.response.viewBox[3]) && (action === OrgChart.action.insert || action === OrgChart.action.expand || action === OrgChart.action.collapse || action === OrgChart.action.update || action === OrgChart.action.init)) {
     
          OrgChart.anim(that.getSvg(),
              { viewbox: prevViewBox },
              { viewbox: that.response.viewBox },
              500,
              OrgChart.anim.inOutPow, function () {
                  that.xScrollUI.setPosition();
                  that.yScrollUI.setPosition();
                  if (!callbackCalled) {
                      if (callback) {
                          callback();
                      }                        
                      OrgChart.events.publish('redraw', [that]);
                      callbackCalled = true;
                  }
              });
      }
      else if (anims[0].length == 0) {
          if (!callbackCalled) {
              if (callback) {
                  callback();
              }
              OrgChart.events.publish('redraw', [that]);
              callbackCalled = true;
          }
      }    
  
      if (!that._initialized){
          that._initialized = true;            
          OrgChart.events.publish('init', [that]);
      }
  }, function(tree){ 
      OrgChart.events.publish('ready', [that, tree]);
  });
};

OrgChart.prototype._setInitialSizeIfNotSet = function () {
  this.element.style.overflow = "hidden";
  this.element.style.position = "relative";

  if (this.element.offsetHeight == 0) {
      this.element.style.height = "100%";
      if (this.element.offsetHeight == 0) {
          this.element.style.height = "700px";
      }
  }

  if (this.element.offsetWidth == 0) {
      this.element.style.width = "100%";
      if (this.element.offsetWidth == 0) {
          this.element.style.width = "700px";
      }
  }
};

OrgChart.prototype.getViewBox = function () {
  var svg = this.getSvg();
  return OrgChart._getViewBox(svg);
};

OrgChart.prototype.setViewBox = function (viewBox) {
  this.getSvg().setAttribute("viewBox", viewBox.toString());
};


OrgChart.prototype.width = function () {
  return this.element.offsetWidth;
};

OrgChart.prototype.height = function () {    
  return this.element.offsetHeight;
};

OrgChart.prototype.getScale = function (viewBox) {
  if (!viewBox) {
      viewBox = this.getViewBox();
  }

  return OrgChart.getScale(viewBox, this.width(), this.height(), this.config.scaleInitial, this.config.scaleMax, this.config.scaleMin);
};

OrgChart.prototype.ripple = function (id, clientX, clientY) {
  var node = this.getNode(id);
  if (node == null) {
      return;
  }
  var nodeElement = this.getNodeElement(id);
  if (nodeElement == null) {
      return;
  }
  
  var scale = this.getScale();

  var x = node.w / 2;
  var y = node.h / 2;

  if (clientX !== undefined && clientY !== undefined) {
      var rect = nodeElement.getBoundingClientRect();
      x = clientX / scale - (rect.left) / scale;
      y = clientY / scale - (rect.top) / scale;
  }

  var w = node.w;
  var h = node.h;

  var dx = (w - x) > x ? (w - x) : x;
  var dy = (h - y) > y ? (h - y) : y;

  dx = dx;
  dy = dy;
  var radius = dx > dy ? dx : dy;

  var rGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  var rClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  var rRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  var rCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  var rId = OrgChart.randomId();
  rClipPath.setAttribute("id", rId);

  var t = OrgChart.t(node.templateName, node.min, this.getScale()); 
  var args = {
      ripple: t.ripple,
      node: node
  };
  OrgChart.events.publish('ripple', [this, args]);

  rRect.setAttribute("x", args.ripple.rect ? args.ripple.rect.x : 0);
  rRect.setAttribute("y", args.ripple.rect ? args.ripple.rect.y : 0);
  rRect.setAttribute("width", args.ripple.rect ? args.ripple.rect.width : node.w);
  rRect.setAttribute("height", args.ripple.rect ? args.ripple.rect.height : node.h);
  rRect.setAttribute("rx", args.ripple.radius);
  rRect.setAttribute("ry", args.ripple.radius);

  rCircle.setAttribute("clip-path", "url(#" + rId + ")");
  rCircle.setAttribute("cx", x);
  rCircle.setAttribute("cy", y);
  rCircle.setAttribute("r", 0);
  rCircle.setAttribute("fill", args.ripple.color);  
  rCircle.setAttribute("class", "ripple");  

  rClipPath.appendChild(rRect);
  rGroup.appendChild(rClipPath);
  rGroup.appendChild(rCircle);  

  nodeElement.appendChild(rGroup);

  OrgChart.anim(rCircle,
      { r: 0, opacity: 1 },
      { r: radius, opacity: 0 },
      500,
      OrgChart.anim.outPow, function () {
          nodeElement.removeChild(rGroup);
      });
};

OrgChart.prototype.center = function (nodeId, options, callback) {
  var parentState;
  var childrenState;
  var rippleId = nodeId;
  var vertical = true;
  var horizontal = true;

  if (options && options.parentState != undefined){
      parentState = options.parentState;
  }
  
  if (options && options.childrenState != undefined){
      childrenState = options.childrenState;
  }
  
  if (options && options.rippleId != undefined){
      rippleId = options.rippleId;
  }
  
  if (options && options.vertical != undefined){
      vertical = options.vertical;
  }

  if (options && options.horizontal != undefined){
      horizontal = options.horizontal;
  }
  var opt = {
      parentState: parentState,    
      childrenState: childrenState,    
      rippleId: rippleId,
      vertical: vertical,
      horizontal: horizontal
  }
  this._draw(false, OrgChart.action.centerNode, { id: nodeId, options: opt}, callback)
};

OrgChart.prototype.fit = function (callback) {
  this.config.scaleInitial = OrgChart.match.boundary;
  this._draw(true, OrgChart.action.init, undefined, callback);
};

OrgChart.prototype.toggleFullScreen = function () {
  var fullBtnElement = document.querySelector("[data-tlbr='fullScreen']");
  if (document.fullscreenElement == this.element || /* Standard syntax */
      document.webkitFullscreenElement == this.element || /* Chrome, Safari and Opera syntax */
      document.mozFullScreenElement == this.element ||/* Firefox syntax */
      document.msFullscreenElement == this.element /* IE/Edge syntax */) {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } 
      else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
      } 
      else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
      } 
      else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
      }

      if (fullBtnElement){
          fullBtnElement.innerHTML = OrgChart.toolbarUI.openFullScreenIcon;
      }
  }
  else {
      if (this.element.requestFullscreen) {
          this.element.requestFullscreen();
      } 
      else if (this.element.mozRequestFullScreen) { /* Firefox */
          this.element.mozRequestFullScreen();
      } 
      else if (this.element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          this.element.webkitRequestFullscreen();
      } 
      else if (this.element.msRequestFullscreen) { /* IE/Edge */
          this.element.msRequestFullscreen();
      }

      if (fullBtnElement){
          fullBtnElement.innerHTML = OrgChart.toolbarUI.closeFullScreenIcon;
      }
  }
};

OrgChart.prototype.getNode = function (nodeId) {
  return this.nodes[nodeId];
};


OrgChart.prototype.setLayout = function (layout, lcn) {
  if (!lcn){
      lcn = "base";
  }
  this._layoutConfigs[lcn].layout = layout;   
  this._draw(false, OrgChart.action.update);
};

OrgChart.prototype.setOrientation = function (orientation, lcn) {
  if (!lcn){
      lcn = "base";
  }
  this._layoutConfigs[lcn].orientation = orientation;
  this._draw(false, OrgChart.action.update);
};

//obsolete
OrgChart.prototype.find = function (value) {
  return this.search(value);
}

OrgChart.prototype.search = function (value, searchInFileds, retrieveFields) {
  if (OrgChart.isNullOrEmpty(searchInFileds)){        
      searchInFileds = this.config.searchFields;
  }
  if (OrgChart.isNullOrEmpty(retrieveFields)){
      retrieveFields = searchInFileds;
  }

  return OrgChart._search.search(
      this.config.nodes,
      value,
      searchInFileds,
      retrieveFields,
      this.config.searchDisplayField,
      this.config.searchFieldsWeight
  );
};


OrgChart.prototype._hideBeforeAnimation = function (animLength) {
  if (this._hideBeforeAnimationCompleted == true) {
      return;
  }

  if (animLength && animLength < OrgChart.ANIM_THRESHOLD) {
      return;
  }

  var texts = this.element.getElementsByTagName("text");

  if (texts.length > OrgChart.TEXT_THRESHOLD) {
      for (var i = 0; i < texts.length; i++) {
          texts[i].style.display = "none";
      }
  }

  var images = this.element.getElementsByTagName("image");

  if (images.length > OrgChart.IMAGES_THRESHOLD) {
      for (var i = 0; i < images.length; i++) {
          images[i].style.display = "none";
      }
  }

  var links = this.element.querySelectorAll("[link-id]");


  if (links.length > OrgChart.LINKS_THRESHOLD) {
      for (var i = 0; i < links.length; i++) {
          links[i].style.display = "none";
      }
  }

  var expcoll = this.element.querySelectorAll("[control-expcoll-id]");

  if (expcoll.length > OrgChart.EXPCOLL_THRESHOLD) {
      for (var i = 0; i < expcoll.length; i++) {
          expcoll[i].style.display = "none";
      }
  }

  this._hideBeforeAnimationCompleted = true;
};


OrgChart.prototype._showAfterAnimation = function () {
  var texts = this.element.getElementsByTagName("text");

  for (var i = 0; i < texts.length; i++) {
      texts[i].style.display = "";
  }    

  var images = this.element.getElementsByTagName("image");

  for (var i = 0; i < images.length; i++) {
      images[i].style.display = "";
  }    

  var links = this.element.querySelectorAll("[link-id]");

  for (var i = 0; i < links.length; i++) {
      links[i].style.display = "";
  }    

  var expcoll = this.element.querySelectorAll("[control-expcoll-id]");

  for (var i = 0; i < expcoll.length; i++) {
      expcoll[i].style.display = "";
  }
  this._hideBeforeAnimationCompleted = false;
};

OrgChart.prototype.isChild = function (id, pid){
  var node = this.getNode(pid);

  while(node){
      if (node.id == id){
          return true;
      }
      if (node.parent){
          node = node.parent;
      }
      else{
          node = node.stParent;
      }
  }

  return false;
};



OrgChart.prototype.getCollapsedIds = function (node) {
  var collapsedChildrenIds = [];
  for(var i = 0; i <  node.childrenIds.length; i++){
      var cnode = this.getNode(node.childrenIds[i]);        
      if (cnode.collapsed == true){
          collapsedChildrenIds.push(cnode.id);
      }
  }
  return collapsedChildrenIds;
};

OrgChart.prototype.stateToUrl = function () {
  if (this.server.state){
      var state = {};
      state.exp = this.server.state.exp.join('*'),
      state.min = this.server.state.min.join('*'),
      state.adjustify = this.server.state.adjustify.x + '*' + this.server.state.adjustify.y;
      state.scale = this.server.state.scale;
      state.y = this.server.state.x;
      state.x = this.server.state.y;

      return new URLSearchParams(state).toString();
  }
  return "";
};

OrgChart.prototype.generateId = function (){
  while (true) {
      var uid = '_' + ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
      if (!this.nodes.hasOwnProperty(uid)) {            
          this.nodes[uid] = true;
          return uid;
      }
  }
};


OrgChart.prototype.destroy = function (){
  this._removeEvent(window, "resize");    
  OrgChart.events.removeForEventId(this._event_id);
  this.element.innerHTML = null;
};





OrgChart.localStorage = {};

OrgChart.localStorage.getItem = function(name){
  return localStorage.getItem(name); 
};

OrgChart.localStorage.setItem = function(name, val){
  try {
      localStorage.setItem(name, val);
  }
  catch (e) {
      if (e.code == e.QUOTA_EXCEEDED_ERR) {
          console.warn('Local storage quota exceeded')
          localStorage.clear();
      }
      else {
          console.error('Local storage error code:' + e.code);
          console.error(e);
      }
  }
};


OrgChart.prototype._canUpdateLink = function (id, pid) {
  if (pid == undefined || pid == null) {
      return false;
  }

  if (id == undefined || id == null) {
      return false;
  }

  if (id == pid) {
      return false;
  }

  var pnode = this.getNode(pid);
  var node = this.getNode(id);
  if (pnode && node){
      if (pnode.isAssistant
          || pnode.isPartner
          || (pnode.hasPartners && node.isAssistant)
          || (pnode.hasAssistants && node.isPartner)){
          return false;
      }
  }

  var isChild = this.isChild(id, pid);
  return !isChild;
};


OrgChart.prototype.updateNode = function (node, callback, fireEvent) {
  var that = this;

  var oldNode = this.get(node.id);

  if (fireEvent === true) {
      var result = OrgChart.events.publish('update', [this, oldNode, node]);
      if (result === false) {
          return false;
      }
  }

  this.update(node);

  var pid = node.pid;
  if (pid == null) {
      pid = node.stpid;
  }
  this._draw(false, OrgChart.action.update, { id: pid }, function () {
      that.ripple(node.id);
      if (callback){
          callback();
      };
      OrgChart.events.publish('updated', [that, oldNode, node]);
  });
};

OrgChart.prototype.update = function (newNode) {
  for (var i = 0; i < this.config.nodes.length; i++) {
      if (this.config.nodes[i].id == newNode.id) {
          this.config.nodes[i] = newNode;
          break;
      }
  }
  return this;
};


OrgChart.prototype.removeNode = function (id, callback, fireEvent) {
  var that = this;

  var newPidsAndStpidsForIds = this._getNewPidsAndStpidsForIds(id);

  if (fireEvent === true) {
      var result = OrgChart.events.publish('remove', [this, id, newPidsAndStpidsForIds]);
      if (result === false) {
          return false;
      }
  }

  this.remove(id);

  this._draw(false, OrgChart.action.update, null, function () {
      if (that.config.sticky){
          OrgChart._moveToBoundaryArea(that.getSvg(), that.getViewBox(), that.response.boundary);
      }
      if (callback){
          callback();
      }
      OrgChart.events.publish('removed', [that, id, newPidsAndStpidsForIds]);
  });

  return true;
};

OrgChart.prototype.remove = function (id) {
  var data = this.get(id);

  if (data){
      for (var i = this.config.nodes.length - 1; i >= 0; i--) {
          if (this.config.nodes[i].pid == id || this.config.nodes[i].stpid == id){
              this.config.nodes[i].pid = data.pid;
              this.config.nodes[i].stpid = data.stpid;
          }            
          if (this.config.nodes[i].id == id) {
              this.config.nodes.splice(i, 1);
          }
      }
  } 

  return this;
};


OrgChart.prototype._getNewPidsAndStpidsForIds = function (id) {
  var data = this.get(id);

  var newPidsForIds = {};
  var newStpidsForIds = {};
  if (data){
      for (var i = this.config.nodes.length - 1; i >= 0; i--) {
          if (this.config.nodes[i].pid == id){
              newPidsForIds[this.config.nodes[i].id] = data.pid;
          }    
          else if (this.config.nodes[i].stpid == id){
              newStpidsForIds[this.config.nodes[i].id] = data.stpid;
          }            
      }
  } 

  return {
      newPidsForIds: newPidsForIds,
      newStpidsForIds: newStpidsForIds
  };
};

OrgChart.prototype.addNode = function (data, callback, fireEvent) {    
  var that = this;
  if (fireEvent === true) {
      var result = OrgChart.events.publish('add', [this, data]);
      if (result === false) {
          return false;
      }
  }

  this.add(data);

  that._draw(false, OrgChart.action.insert, { id: data.pid, insertedNodeId: data.id }, function(){
      that.ripple(data.id);
      if (callback){
          callback();
      }
      OrgChart.events.publish('added', [that, data.id]);
  });    
  OrgChart.events.publish('adding', [that, data.id]);

};

OrgChart.prototype.add = function (data) {
  if (data.id == undefined) {
      console.error("Call addNode without id");
  }

  this.config.nodes.push(data);

  return this;
};

OrgChart.prototype._get = function (id) {
  for (var i = 0; i < this.config.nodes.length; i++) {
      if (this.config.nodes[i].id == id) {
          return this.config.nodes[i];
      }
  }

  return null;
};

OrgChart.prototype.get = function (id) {
  for (var i = 0; i < this.config.nodes.length; i++) {
      if (this.config.nodes[i].id == id) {
          return JSON.parse(JSON.stringify(this.config.nodes[i]));
      }
  }

  return null;
};
if (typeof(OrgChart) == "undefined") {
  OrgChart = {};
}


OrgChart._ajax = function (url, verb, data, resType, callback) {
  if (resType == undefined){
      resType = "arraybuffer";
  }
  var xhr = new XMLHttpRequest();

  xhr.onload = function (evt) {
      //if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.readyState == 4) {
          if (this.status === 200) {
              callback(evt.target.response);    
          }
      }
  }

  xhr.onerror = function (error) {
      callback({error: error});
  }

  xhr.open(verb, url);
  xhr.responseType = resType;
  //xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/json");
  if (data == null) {
      xhr.send();
  }
  else {
      xhr.send(data);
  }
}

if (typeof(OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.anim = function (_elements, attrStart, attrEnd, duration, func, callback, tick) {
  var delay = 10;
  var increment = 1;
  var repetitions = 1;
  var limit = duration / delay + 1;
  var timer;    

  var g = document.getElementsByTagName("g");

  if (!Array.isArray(_elements)) {//check if it is not an array
      _elements = [_elements];
  }
  if (!Array.isArray(attrStart)) {//check if it is not an array
      attrStart = [attrStart];
  }
  if (!Array.isArray(attrEnd)) {//check if it is not an array
      attrEnd = [attrEnd];
  }

  function doAction() {
      for (var z3 = 0; z3 < _elements.length; z3++) {
          for (var n in attrEnd[z3]) {
              var pxFixDoctype = OrgChart._arrayContains(["top", "left", "right", "bottom", "width", "height"], n.toLowerCase()) ? "px" : "";
              switch (n.toLowerCase()) {
                  case "d":
                      var xVal = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n][0] - attrStart[z3][n][0]) + attrStart[z3][n][0];
                      var yVal = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n][1] - attrStart[z3][n][1]) + attrStart[z3][n][1];

                      _elements[z3].setAttribute("d", _elements[z3].getAttribute("d") + " L" + xVal + " " + yVal);
                      break;

                  case "r":
                      var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];      
                      _elements[z3].setAttribute("r", val);
                      break;

                  case "rotate3d":
                      if (attrEnd[z3][n]) {
                          var matrixStart = attrStart[z3][n];
                          var matrixEnd = attrEnd[z3][n];
                          var matrixTemp = [0, 0, 0, 0];
                          for (var i in matrixStart) {
                              matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                          }
                          _elements[z3].style.transform = 'rotate3d(' + matrixTemp.toString() + 'deg)';
                      }
                      break;

                  case "transform":
                      if (attrEnd[z3][n]) {
                          var matrixStart = attrStart[z3][n];
                          var matrixEnd = attrEnd[z3][n];
                          var matrixTemp = [0, 0, 0, 0, 0, 0];
                          for (var i in matrixStart) {
                              matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                          }

                          if (_elements[z3].hasAttribute('transform')){
                              _elements[z3].setAttribute("transform", "matrix(" + matrixTemp.toString() + ")");
                          }
                          else{
                              _elements[z3].style.transform = "matrix(" + matrixTemp.toString() + ")";                                
                          }
                      }
                      break;
                  case "viewbox":
                      if (attrEnd[z3][n]) {
                          var matrixStart = attrStart[z3][n];
                          var matrixEnd = attrEnd[z3][n];
                          var matrixTemp = [0, 0, 0, 0];
                          for (var i in matrixStart) {
                              matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];
                          }

                          //for (var z4 = 0; z4 < _elements.length; z4++) {
                          _elements[z3].setAttribute("viewBox", matrixTemp.toString());
                          //}
                      }
                      break;
                  case "margin":
                      if (attrEnd[z3][n]) {
                          var matrixStart = attrStart[z3][n];
                          var matrixEnd = attrEnd[z3][n];
                          var matrixTemp = [0, 0, 0, 0];

                          for (var i in matrixStart)
                              matrixTemp[i] = func(((repetitions * delay) - delay) / duration) * (matrixEnd[i] - matrixStart[i]) + matrixStart[i];

                          var margin = "";
                          for (var i = 0; i < matrixTemp.length; i++)
                              margin += parseInt(matrixTemp[i]) + "px ";


                          //for (var z5 = 0; z5 < _elements.length; z5++) {
                          if (_elements[z3] && _elements[z3].style) {
                              _elements[z3].style[n] = margin;
                              }
                          //}
                      }
                      break;
                  case "scrolly":
                          var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                          _elements[z3].scrollTo(0, val);
                          break;
                  default:
                      var val = func(((repetitions * delay) - delay) / duration) * (attrEnd[z3][n] - attrStart[z3][n]) + attrStart[z3][n];
                      //for (var z6 = 0; z6 < _elements.length; z6++) {
                      if (_elements[z3] && _elements[z3].style) {
                          _elements[z3].style[n] = val + pxFixDoctype;
                          }
                      //}
                      break;
              }
          }
      }


      if (tick) {
          tick();
      }
      repetitions = repetitions + increment;
      if (repetitions > limit + 1) {
          clearInterval(timer);
          if (callback)
              callback(_elements);
      }
  }

  timer = setInterval(doAction, delay);
  return timer;
};


OrgChart.anim.inPow = function (x) {
  var p = 2;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return Math.pow(x, p);
};
   
OrgChart.anim.outPow = function (x) {
  var p = 2;
  if (x < 0) return 0;
  if (x > 1) return 1;
  var sign = p % 2 === 0 ? -1 : 1;
  return (sign * (Math.pow(x - 1, p) + sign));
};
   
OrgChart.anim.inOutPow = function (x) {
  var p = 2;
  if (x < 0) return 0;
  if (x > 1) return 1;
  x *= 2;
  if (x < 1) return OrgChart.anim.inPow(x, p) / 2;
  var sign = p % 2 === 0 ? -1 : 1;
  return (sign / 2 * (Math.pow(x - 2, p) + sign * 2));
};

OrgChart.anim.inSin = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return -Math.cos(x * (Math.PI / 2)) + 1;
};
   
OrgChart.anim.outSin = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return Math.sin(x * (Math.PI / 2));
};
   
OrgChart.anim.inOutSin = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return -0.5 * (Math.cos(Math.PI * x) - 1);
};
   
OrgChart.anim.inExp = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return Math.pow(2, 10 * (x - 1));
};
   
OrgChart.anim.outExp = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return -Math.pow(2, -10 * x) + 1;
};
   
OrgChart.anim.inOutExp = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x < 0.5 ? 0.5 * Math.pow(2, 10 * (2 * x - 1)) : 0.5 * (-Math.pow(2, 10 * (-2 * x + 1)) + 2);
};
   
OrgChart.anim.inCirc = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return -(Math.sqrt(1 - x * x) - 1);
};
   
OrgChart.anim.outCirc = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return Math.sqrt(1 - (x - 1) * (x - 1));
};
   
OrgChart.anim.inOutCirc = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x < 1 ? -0.5 * (Math.sqrt(1 - x * x) - 1) : 0.5 * (Math.sqrt(1 - ((2 * x) - 2) * ((2 * x) - 2)) + 1);
};

OrgChart.anim.rebound = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  if (x < (1 / 2.75)) return 1 - 7.5625 * x * x;
  else if (x < (2 / 2.75)) return 1 - (7.5625 * (x - 1.5 / 2.75) * (x - 1.5 / 2.75) + 0.75);
  else if (x < (2.5 / 2.75)) return 1 - (7.5625 * (x - 2.25 / 2.75) * (x - 2.25 / 2.75) + 0.9375);
  else return 1 - (7.5625 * (x - 2.625 / 2.75) * (x - 2.625 / 2.75) + 0.984375);
};
   
OrgChart.anim.inBack = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x * x * ((1.70158 + 1) * x - 1.70158);
};
   
OrgChart.anim.outBack = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return (x - 1) * (x - 1) * ((1.70158 + 1) * (x - 1) + 1.70158) + 1;
};
  
OrgChart.anim.inOutBack = function (x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x < 0.5 ? 0.5 * (4 * x * x * ((2.5949 + 1) * 2 * x - 2.5949)) : 0.5 * ((2 * x - 2) * (2 * x - 2) * ((2.5949 + 1) * (2 * x - 2) + 2.5949) + 2);
};

OrgChart.anim.impulse = function (x) {
  var k = 2;
  var h = k * x;
  return h * Math.exp(1 - h);
};
   
OrgChart.anim.expPulse = function (x) {
  var k = 2;
  var n = 2;
  return Math.exp(-k * Math.pow(x, n));
};

if (typeof(OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.prototype._attachInitEventHandlers = function (svg) { 
  //resize
  this._addEvent(window, "resize", this._resizeHandler);         
}

OrgChart.prototype._attachEventHandlers = function (svg) {
  var svg = this.getSvg();

  var isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (this.config.enableTouch || isIOS || /Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
      this._addEvent(svg, "touchstart", this._globalMouseDownHandler);
      this._addEvent(svg, "touchend", this._globalClickHandler);
  }
  else {
      this._addEvent(svg, "mousedown", this._globalMouseDownHandler);
      this._addEvent(svg, "click", this._globalClickHandler);
      this._addEvent(svg, "contextmenu", this._globalContextHandler);
      this._addEvent(svg, "dblclick", this._globalDbClickHandler);
      //zoom
      if (this.config.mouseScrool == OrgChart.action.zoom || this.config.mouseScrool == OrgChart.action.ctrlZoom) {
          this._addEvent(svg, "DOMMouseScroll", this._mouseScrollHandler);
          this._addEvent(svg, "mousewheel", this._mouseScrollHandler);
      }    
  }    

  var exportMenuButton = this.getExportMenuButton();
  if (exportMenuButton) {
      this._addEvent(exportMenuButton, "click", this._exportMenuClickHandler);
  }    
};

// add event cross browser
OrgChart.prototype._addEvent = function (elem, event, fn, id) {
  // avoid memory overhead of new anonymous functions for every event handler that's installed
  // by using local functions

  if (!id) {
      id = "";
  }

  if (!elem.getListenerList) {
      elem.getListenerList = {};
  }


  if (elem.getListenerList[event + id]) {
      //already registered for that event
      return;
  }

  function runHandlerInContextOf(context, handler) {
      return function () {
          if (handler)
              return handler.apply(context, [this, arguments[0]]);
      }
  }
  fn = runHandlerInContextOf(this, fn);

  function listenHandler(e) {
      var ret = fn.apply(this, arguments);
      if (ret === false) {
          e.stopPropagation();
          e.preventDefault();
      }
      return (ret);
  }

  function attachHandler() {
      // set the this pointer same as addEventListener when fn is called
      // and make sure the event is passed to the fn also so that works the same too
      var ret = fn.call(elem, window.event);
      if (ret === false) {
          window.event.returnValue = false;
          window.event.cancelBubble = true;
      }
      return (ret);
  }

  if (elem.addEventListener) {        
      if (event == "mousewheel"){ //#358 fix 
          elem.addEventListener(event, listenHandler, {passive: false});
      }
      else{
          elem.addEventListener(event, listenHandler, false);
      }
  } else {
      elem.attachEvent("on" + event, attachHandler);
  }


  elem.getListenerList[event + id] = listenHandler;
};

OrgChart.prototype._removeEvent = function (elem, event) {
  if (elem.getListenerList[event]) {
      var listener = elem.getListenerList[event];
      elem.removeEventListener(event, listener, false);
      delete elem.getListenerList[event];
  }
};




if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}
OrgChart.VERSION = "7.7.13";

OrgChart.orientation = {};

OrgChart.orientation.top = 0;
OrgChart.orientation.bottom = 1;
OrgChart.orientation.right = 2;
OrgChart.orientation.left = 3;
OrgChart.orientation.top_left = 4;
OrgChart.orientation.bottom_left = 5;
OrgChart.orientation.right_top = 6;
OrgChart.orientation.left_top = 7;
OrgChart.CENTER = 8;
OrgChart.ORIENTATION = 9;
OrgChart.TEXT_THRESHOLD = 250;
OrgChart.IMAGES_THRESHOLD = 70;
OrgChart.LINKS_THRESHOLD = 150;
OrgChart.EXPCOLL_THRESHOLD = 40;
OrgChart.ANIM_THRESHOLD = 50;

OrgChart.ID = "id";
OrgChart.PID = "pid";
OrgChart.STPID = "stpid";
OrgChart.TAGS = "tags";
OrgChart.NODES = "nodes";
OrgChart.ELASTIC = "elastic";
OrgChart.MAX_DEPTH = 200;
OrgChart.SCALE_FACTOR = 1.44;
OrgChart.LAZY_LOADING_FACTOR = 500;
OrgChart.action = {};
OrgChart.action.expand = 0;
OrgChart.action.collapse = 1;
OrgChart.action.maximize = 101;
OrgChart.action.minimize = 102;
OrgChart.action.expandCollapse = 501;
OrgChart.action.edit = 1;
OrgChart.action.zoom = 2;
OrgChart.action.ctrlZoom = 22;
OrgChart.action.scroll = 41;
OrgChart.action.xScroll = 3;
OrgChart.action.yScroll = 4;
OrgChart.action.none = 5;
OrgChart.action.init = 6;
OrgChart.action.update = 7;
OrgChart.action.pan = 8;
OrgChart.action.centerNode = 9;
OrgChart.action.resize = 10;
OrgChart.action.insert = 11;
OrgChart.action.insertfirst = 12;
OrgChart.action.details = 13;
OrgChart.action.exporting = 14;
OrgChart.none = 400001;
OrgChart.scroll = {};
OrgChart.scroll.visible = 1;
OrgChart.scroll.smooth = 12;
OrgChart.scroll.speed = 120;
OrgChart.scroll.safari = {
  smooth: 12,
  speed: 250
};
OrgChart.match = {};
OrgChart.match.height = 100001;
OrgChart.match.width = 100002;
OrgChart.match.boundary = 100003;
OrgChart.COLLAPSE_PARENT_NEIGHBORS = 1;
OrgChart.COLLAPSE_SUB_CHILDRENS = 2;
OrgChart.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED = 3;
OrgChart.normal = 0;
OrgChart.mixed = 1;
OrgChart.tree = 2;
OrgChart.treeLeftOffset = 3;
OrgChart.treeRightOffset = 4;
OrgChart.nodeOpenTag = '<g node-id="{id}" style="opacity: {opacity}" transform="matrix(1,0,0,1,{x},{y})" class="{class}" sl="{sl}" l={level} {lcn}>';
OrgChart.linkOpenTag = '<g link-id="[{id}][{child-id}]" class="{class}">';
OrgChart.expcollOpenTag = '<g control-expcoll-id="{id}" transform="matrix(1,0,0,1,{x},{y})"  style="cursor:pointer;">';
OrgChart.linkFieldsOpenTag = '<g transform="matrix(1,0,0,1,{x},{y}) rotate({rotate})">';
OrgChart.grCloseTag = '</g>';

OrgChart.IT_IS_LONELY_HERE = '<g transform="translate(-100, 0)" style="cursor:pointer;"  control-add="control-add"><text fill="#039be5">{link}</text></g>';
OrgChart.RES = {};
OrgChart.RES.IT_IS_LONELY_HERE_LINK = "It's lonely here, add your first node";

OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE = 3;
OrgChart.STRING_TAGS = false;


OrgChart.MAX_NODES_MESS = "The trial has expired or 200 nodes limit was reached! <br /><a style='color: #039BE5;' target='_blank' href=''>See more</a>";
OrgChart.OFFLINE_MESS = "The evaluation version requires internet connection! <br /><a style='color: #039BE5;' target='_blank' href=''>See more</a>";
OrgChart.SEARCH_PLACEHOLDER = 'Search';
OrgChart.IMPORT_MESSAGE = "Choose the columns (fields) in your data file that contain the required information.";
OrgChart.FIXED_POSITION_ON_CLICK = false;
OrgChart.ADD_NEW_FIELD = 'Add new field';
OrgChart.ASSISTANT = 'Assistant';

OrgChart.A4w = 595;
OrgChart.A4h = 842;
OrgChart.A3w = 842;
OrgChart.A3h = 1191;
OrgChart.A2w = 1191;
OrgChart.A2h = 1684;
OrgChart.A1w = 1684;
OrgChart.A1h = 2384;
OrgChart.Letterw = 612;
OrgChart.Letterh = 791;
OrgChart.Legalw = 612;
OrgChart.Legalh = 1009;

OrgChart.LINK_ROUNDED_CORNERS = 8;



OrgChart.MOVE_STEP = 5;
OrgChart.MOVE_INTERVAL = 25;

OrgChart.MIXED_LAYOUT_ALL_NODES = true;
OrgChart.CLINK_CURVE = 1;


OrgChart.SEARCH_RESULT_LIMIT = 10;



if (typeof(module) != "undefined"){
  module.exports = OrgChart;
}


OrgChart.input = function (label, value, placeholder, readOnly, isImg, _that) {
  if (readOnly == undefined) {
      readOnly = false;
  }
  var wrapperElement = document.createElement("div");
  var labelElement = document.createElement("div");
  var inputElement = document.createElement("input");
  var hrElement = document.createElement("hr");
  var uploadBtnElement = document.createElement("button");

  uploadBtnElement.innerHTML = "Upload";
  uploadBtnElement.style.position = "absolute";
  uploadBtnElement.style.right = 0;
  wrapperElement.style.margin = "14px 14px 7px 14px";
  wrapperElement.style.textAlign = "left";
  wrapperElement.style.position = "relative";
  wrapperElement.setAttribute('data-field-name', label);
  hrElement.style.border = "1px solid #d7d7d7";
  hrElement.style.backgroundColor = "#d7d7d7";
  hrElement.style.display = "block";
  hrElement.style.width = "100%";
  //labelElement.style["floa"] = "left";
  labelElement.style.color = "#bcbcbc";
  inputElement.style.border = "none";
  inputElement.style.outline = "none";
  inputElement.style.width = "100%";
  inputElement.setAttribute('val', '');
  if (isImg) {
      inputElement.style.width = "80%";
  }
  inputElement.style.fontSize = "16px";

  inputElement.readOnly = readOnly;

  if (value != undefined && value != null) {
      inputElement.value = value;
  }

  if (placeholder != undefined && placeholder != null) {
      inputElement.placeholder = placeholder;
  }

  if (label != undefined && label != null) {
      labelElement.innerHTML = label;
  }   

  labelElement.setAttribute("lbl", '');
  inputElement.style.color = "#7a7a7a";

  if (!readOnly) {
      inputElement.addEventListener("focus", function () {
          var hrElement = this.parentNode.getElementsByTagName("hr")[0];
          
          hrElement.style.border = "1px solid #039BE5";
          OrgChart.anim(hrElement,
              { width: 10 },
              { width: wrapperElement.clientWidth },
              250,
              OrgChart.anim.inOutSin
          );
      });
  }

  uploadBtnElement.addEventListener("click", function () {
      var that = this;
      var fileUpload = document.createElement("INPUT");
      fileUpload.setAttribute("type", "file");
      fileUpload.style.display = "none";
      fileUpload.onchange = function () {            
          var file = this.files[0];
          OrgChart.events.publish('imageuploaded', [_that, file, that.parentNode.querySelector("input")]);            
      };
      document.body.appendChild(fileUpload);
      fileUpload.click();
  });

  inputElement.addEventListener("blur", function () {
      var hrElement = this.parentNode.getElementsByTagName("hr")[0];
      hrElement.style.border = "1px solid #d7d7d7";
  });

  wrapperElement.appendChild(labelElement);
  wrapperElement.appendChild(inputElement);
  if (isImg) {
      wrapperElement.appendChild(uploadBtnElement);
  }
  wrapperElement.appendChild(hrElement);

  if (OrgChart.addValidation) {
      var elements = {
          wrapper: wrapperElement,
          label: labelElement,
          input: inputElement,
          hr: hrElement
      };

      OrgChart.addValidation(label, value, elements);
  }

  return wrapperElement;
}


OrgChart._intersects = function (n1, point, config) {
  var a = n1.x - config.siblingSeparation / 4;
  var b = n1.y;
  var c = n1.x + n1.w + config.siblingSeparation / 4;
  var d = n1.y;

  switch (config.orientation) {
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          a = n1.x;
          b = n1.y - config.siblingSeparation / 4;
          c = n1.x ;
          d = n1.y + n1.h + config.siblingSeparation / 4;
          break;
  }

  var p = point.p;
  var q = point.q;
  var r = point.r;
  var s = point.s;

  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
      return false;
  } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

OrgChart._addPoint = function (node, path, config, point, align) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
          return OrgChart._addPointTop(node, path, config, point, align);
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          return OrgChart._addPointBottom(node, path, config, point, align);
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return OrgChart._addPointLeft(node, path, config, point, align);
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
          return OrgChart._addPointRight(node, path, config, point, align);
  }
};

OrgChart._addPointTop = function (node, path, config, point, align) {
  var p;
  var q;
  var r;


  if (align == "left") {
      if (node.leftNeighbor) {
          p = node.x + (node.leftNeighbor.x + node.leftNeighbor.w - (node.x)) / 2;
      }
      else {
          p = node.x - config.siblingSeparation / 2;
      }
  }
  else if (align == "right") {
      if (node.rightNeighbor) {
          p = node.x + node.w + (node.rightNeighbor.x - (node.x + node.w)) / 2;
      }
      else {
          p = node.x + node.w + config.siblingSeparation / 2;
      }
  }

  path.push([p, path[path.length - 1][1]]);
  path.push([p, node.y - config.levelSeparation / 3]);

  q = path[path.length - 1][1];
  r = p;

  point.p = p;
  point.q = q;
  point.r = r;

  return point;
};


OrgChart._addPointBottom = function (node, path, config, point, align) {
  var p;
  var q;
  var r;

  if (align == "left") {
      if (node.leftNeighbor) {
          p = node.x + (node.leftNeighbor.x + node.leftNeighbor.w - (node.x)) / 2;
      }
      else {
          p = node.x - config.siblingSeparation / 2;
      }
  }
  else if (align == "right") {
      if (node.rightNeighbor) {
          p = node.x + node.w + (node.rightNeighbor.x - (node.x + node.w)) / 2;
      }
      else {
          p = node.x + node.w + config.siblingSeparation / 2;
      }
  }

  path.push([p, path[path.length - 1][1]]);
  path.push([p, node.y + node.h + config.levelSeparation / 3]);

  q = path[path.length - 1][1];
  r = p;

  point.p = p;
  point.q = q;
  point.r = r;



  return point;
};


OrgChart._addPointLeft = function (node, path, config, point, align) {
  var p = path[path.length - 1][0];;
  var q;
  var r;

  if (align == "bottom") {
      if (node.rightNeighbor) {
          q = node.y + node.h + (node.rightNeighbor.y - (node.y + node.h)) / 2;
      }
      else {
          q = node.y + node.h + config.siblingSeparation / 2;
      }

  }
  else if (align == "top") {
      if (node.leftNeighbor) {
          q = node.y + (node.leftNeighbor.y + node.leftNeighbor.h - (node.y)) / 2;
      }
      else {
          q = node.y - config.siblingSeparation / 2;
      }
  }

  path.push([path[path.length - 1][0], q]);
  path.push([node.x - config.levelSeparation / 3, q]);

  p = path[path.length - 1][0];
  s = q;

  point.p = p;
  point.q = q;
  point.s = s;

  return point;
};



OrgChart._addPointRight = function (node, path, config, point, align) {
  var p = path[path.length - 1][0];;
  var q;
  var r;

  if (align == "bottom") {
      if (node.rightNeighbor) {
          q = node.y + node.h + (node.rightNeighbor.y - (node.y + node.h)) / 2;
      }
      else {
          q = node.y + node.h + config.siblingSeparation / 2;
      }

  }
  else if (align == "top") {
      if (node.leftNeighbor) {
          q = node.y + (node.leftNeighbor.y + node.leftNeighbor.h - (node.y)) / 2;
      }
      else {
          q = node.y - config.siblingSeparation / 2;
      }
  }

  path.push([path[path.length - 1][0], q]);
  path.push([node.x + node.w + config.levelSeparation / 3, q]);

  p = path[path.length - 1][0];
  s = q;

  point.p = p;
  point.q = q;
  point.s = s;

  return point;
};


OrgChart.editUI = function () {
};

OrgChart.editUI.prototype.init = function (obj) {
  this.obj = obj;
  this.fields = null;
  this.node = null;    
  this._event_id = OrgChart._guid();
};

OrgChart.editUI.prototype.on = function(event, callback){
  OrgChart.events.on(event, callback, this._event_id);
  return this;
};

OrgChart.editUI.prototype.show = function (id, readOnly) { 
  this.hide();
  var result = OrgChart.events.publish('show', [this, id]);
  if (result === false) {
      return false;
  }
  this.node = this.obj.getNode(id);
  this.wrapperElement = document.getElementById("bgEditForm");
  if (this.wrapperElement) {
      this.obj.element.removeChild(this.wrapperElement);
  }
  this.wrapperElement = document.createElement("div");
  this.wrapperElement.className = 'edit-wrapper';
  var editViewElement = document.createElement("div");
  editViewElement.className = 'edit-view';
  var detailsViewElement = document.createElement("div");
  detailsViewElement.className = 'details-view';


  var isMobile = window.matchMedia("(max-width: 1150px)").matches;

  var width = "400px";
  if (isMobile) {
      width = "100%";
  }
  Object.assign(this.wrapperElement.style, {
      width: width, position: "absolute", top: 0, right: "-150px", opacity: 0, "border-left": "1px solid #d7d7d7", "text-align": "left", height: "100%", "background-color": "#ffffff"
  });


  if (readOnly) {
      this._createDetailsView(this.node, detailsViewElement);
  }
  else {
      this._createEditView(this.node, editViewElement);
  }
};

OrgChart.editUI.prototype._createDetailsView = function (node, detailsViewElement) {
  var that = this;
  
  var photoElement = document.createElement("div");
  photoElement.className = 'edit-photo';
  var hideElement = document.createElement("div");
  var fieldContentElement = document.createElement("div");
  fieldContentElement.className = 'edit-fields';
  var tagsElement = document.createElement("div");
  tagsElement.className = 'edit-tags';

  hideElement.innerHTML = '<svg style="width: 34px; height: 34px;"><path style="fill:#ffffff;" d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"></path></svg>';

  Object.assign(hideElement.style, {
      cursor: "pointer", width: "34px", height: "34px", position: "absolute", top: "7px", right: "7px"
  });

  Object.assign(fieldContentElement.style, {
      "overflow-x": "hidden", "overflow-y": "auto"
  });

  Object.assign(photoElement.style, {
      "background-color": "#039BE5", "min-height": "50px", textAlign: "center", position: "relative"
  });

  Object.assign(tagsElement.style, {
      margin: "12px"
  });
  

  this.wrapperElement.appendChild(detailsViewElement);
  detailsViewElement.appendChild(photoElement);
  detailsViewElement.appendChild(fieldContentElement);
  fieldContentElement.appendChild(tagsElement);

  photoElement.appendChild(hideElement);

  OrgChart.htmlRipple(photoElement);
  var fields = this.fields;
  var data = this.obj._get(node.id);

  for (var i = 0; i < fields.length; i++) {
      var value = data[fields[i]];
      if (OrgChart._fieldIsImg(this.obj.config, fields[i])) {
          var img = document.createElement("img");
          img.src = value;
          img.style.width = "100px";
          img.style.margin = "10px";
          img.style.borderRadius = "50px";

          this._addField(
              photoElement, 
              img, 
              fields[i],
              'details');
      }
      else if (fields[i] == "tags") {
          if (value) {
              for (var q = 0; q < value.length; q++) {
                  var tagElement = document.createElement("span");
                  Object.assign(tagElement.style, {
                      "background-color": "#F57C00", color: "#ffffff", margin: "2px", padding: "2px 12px", "border-radius": "10px", display: "inline-block", border: "1px solid #FFCA28", "user-select": "none"
                  });
                  tagElement.innerHTML = value[q];

                  this._addField(
                      tagsElement, 
                      tagElement, 
                      value[q],
                      'details-tag');
              }
          }
      }
      else {
          this._addField(
              fieldContentElement, 
              OrgChart.input(fields[i], value, null, true, undefined, that), 
              fields[i],
              'details');
      }
  }

  this.obj.element.appendChild(this.wrapperElement);

  photoElement.addEventListener("click", function () {
      that.hide(false);
  });

  this.obj._hideBeforeAnimation();
  OrgChart.anim(this.wrapperElement,
      { right: -150, opacity: 0 },
      { right: 0, opacity: 0.9 },
      300,
      OrgChart.anim.inOutSin,
      function () {
          that.obj._showAfterAnimation();
          fieldContentElement.style.height = (that.obj.element.offsetHeight - photoElement.offsetHeight) + "px";
      }
  );
};

OrgChart.editUI.prototype._addField = function(fieldContentElement, fieldElement, name, type){
  var args = {
      name: name,
      field: fieldElement,
      type: type
  }

  var result = OrgChart.events.publish('field', [this, args]);

  if (result !== false) {                    
      fieldContentElement.appendChild(args.field);
  }
}

OrgChart.editUI.prototype._createEditView = function (node, editViewElement) {
  var that = this;

  var photoElement = document.createElement("div");
  photoElement.className = 'edit-photo';

  var hideElement = document.createElement("div");
  var addMoreFieldsElement = document.createElement("div");
  var fieldContentElement = document.createElement("div");
  fieldContentElement.className = 'edit-fields';

  var assistantButtonContentElement = document.createElement("div");
  assistantButtonContentElement.className = 'edit-assistant-button-content';

  hideElement.innerHTML = '<svg style="width: 34px; height: 34px;"><path style="fill:#ffffff;" d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"></path></svg>';

  this.wrapperElement.id = "bgEditForm";

  Object.assign(hideElement.style, {
      cursor: "pointer", width: "34px", height: "34px", position: "absolute", top: "7px", right: "7px"
  });

  Object.assign(fieldContentElement.style, {
      "overflow-x": "hidden", "overflow-y": "auto"
  });

  Object.assign(photoElement.style, {
      "background-color": "#039BE5", "min-height": "50px", textAlign: "center", position: "relative"
  });

  Object.assign(addMoreFieldsElement.style, {
      margin: "14px 14px 7px", color: "#4285F4", cursor: "pointer"
  });

  Object.assign(assistantButtonContentElement.style, {
      margin: "14px 14px 7px", color: "rgb(188, 188, 188)"
  });


  addMoreFieldsElement.innerHTML = OrgChart.ADD_NEW_FIELD;

  var checked = OrgChart._arrayContains(this.node.tags, "assistant") ? "checked" : "";
  assistantButtonContentElement.setAttribute('data-field-name', 'isAssistant');
  assistantButtonContentElement.innerHTML = '<div style="margin-top: 10px;display:inline-block;">' + OrgChart.ASSISTANT + '</div><label class="bg-switch"><input val type="checkbox" ' + checked + '><span class="bg-slider round"></span></label>';

  this.wrapperElement.appendChild(editViewElement);
  editViewElement.appendChild(photoElement);
  editViewElement.appendChild(fieldContentElement);

  photoElement.appendChild(hideElement);

  

  OrgChart.htmlRipple(photoElement);

  var fields = this.fields;
  var data = this.obj._get(node.id);


  for (var i = 0; i < fields.length; i++) {
      var value = data[fields[i]];
      if (fields[i] != "tags") {
          if (OrgChart._fieldIsImg(this.obj.config, fields[i])) {
              
              if (value) {
                  var img = document.createElement("img");
                  img.src = value;
                  img.style.width = "100px";
                  img.style.margin = "10px";
                  img.style.borderRadius = "50px";

                  photoElement.appendChild(img);
              }
              this._addField(
                  fieldContentElement, 
                  OrgChart.input(fields[i], value, null, false, true, that), 
                  fields[i],
                  'edit');
          }
          else {
              this._addField(
                  fieldContentElement, 
                  OrgChart.input(fields[i], value, null, false, undefined, that), 
                  fields[i],
                  'edit');
          }
      }  
  }

  if (node.childrenIds.length == 0 && node.parent) {
      this._addField(fieldContentElement, assistantButtonContentElement, 'isAssistant', 'edit');
  }

  this._addField(fieldContentElement, addMoreFieldsElement, OrgChart.ADD_NEW_FIELD, 'edit');

  this.obj.element.appendChild(this.wrapperElement);

  photoElement.addEventListener("click", function () {
      that.hide(true);
  });

  addMoreFieldsElement.addEventListener("click", function () {        
      if (addMoreFieldsElement.innerHTML == "Save") {
          OrgChart.anim(addMoreFieldsElement,
              { opacity: 1 },
              { opacity: 0 },
              200,
              OrgChart.anim.inSin,
              function () {
                  addMoreFieldsElement.innerHTML = OrgChart.ADD_NEW_FIELD;
                  addMoreFieldsElement.style.textAlign = "left";

                  var input = document.getElementById("bgNewField");
                  var lbl = input.getElementsByTagName("input")[0].value;
                  fieldContentElement.removeChild(input);
                  if (lbl && !OrgChart._arrayContains(that.fields, lbl)) {
                      var newField = OrgChart.input(lbl);
                      newField.style.opacity = 0;
                      fieldContentElement.insertBefore(newField, addMoreFieldsElement);
                      OrgChart.anim(newField, { opacity: 0 }, { opacity: 1 }, 200, OrgChart.anim.inSin,
                          function () {
                              newField.getElementsByTagName("input")[0].focus();
                          });
                  }
                  OrgChart.anim(addMoreFieldsElement, { opacity: 0 }, { opacity: 1 }, 200, OrgChart.anim.inSin);
              }
          );
      }
      else {
          OrgChart.anim(addMoreFieldsElement,
              { opacity: 1 },
              { opacity: 0 },
              200,
              OrgChart.anim.inSin,
              function () {
                  addMoreFieldsElement.innerHTML = 'Save';
                  addMoreFieldsElement.style.textAlign = "right";
                  OrgChart.anim(addMoreFieldsElement, { opacity: 0 }, { opacity: 1 }, 200, OrgChart.anim.inSin);
              }
          );
          var input = OrgChart.input(null, null, "Field name");
          input.style.opacity = 0;
          input.id = "bgNewField";
          fieldContentElement.appendChild(input);
          OrgChart.anim(input,
              { opacity: 0 },
              { opacity: 1 },
              200,
              OrgChart.anim.inSin,
              function () {
                  input.getElementsByTagName("input")[0].focus();
              }
          );
      }
  });

  this.obj._hideBeforeAnimation();
  OrgChart.anim(this.wrapperElement,
      { right: -150, opacity: 0 },
      { right: 0, opacity: 0.9 },
      300,
      OrgChart.anim.inOutSin,
      function () {
          that.obj._showAfterAnimation();
          fieldContentElement.style.height = (that.obj.element.offsetHeight - photoElement.offsetHeight) + "px";

          if (that.wrapperElement.getElementsByTagName("input").length > 1)
              that.wrapperElement.getElementsByTagName("input")[0].focus();
      }
  );
};

OrgChart.editUI.prototype.hide = function (showldUpdateTheNode) {
  
  if (!this.wrapperElement) {
      return;
  }    
  var result = OrgChart.events.publish('hide', [this]);
  if (result === false) {
      return false;
  }
  var data = this.obj.get(this.node.id);

  
  if (showldUpdateTheNode) {//updtae node data only if there is 
      var elements = this.wrapperElement.querySelectorAll("[data-field-name]");
      for (var i = 0; i < elements.length; i++) {
          var fieldName = elements[i].getAttribute('data-field-name');
         
          if (fieldName) {
              var value = elements[i].querySelector("[val]").value;
              if (fieldName === OrgChart.TAGS) {
                  data.tags = value.split(",");
              }
              else if (fieldName === "isAssistant") {
                  var checked = elements[i].querySelector("[val]").checked;
                  if (checked && data.tags) {                        
                      if (!OrgChart._arrayContains(this.node.tags, "assistant")) {
                          if (OrgChart.STRING_TAGS){
                              data.tags += ',assistant';
                          }
                          else{
                              data.tags.push('assistant');
                          }
                      }
                  }
                  else if (checked && !data.tags) {
                      if (OrgChart.STRING_TAGS){
                          data.tags = 'assistant';
                      }
                      else{
                          data.tags = ['assistant'];
                      }
                  }
                  else if (!checked && data.tags) {
                      if (this.node.tags.indexOf("assistant") != -1) {                            
                          data.tags.splice(data.tags.indexOf("assistant"), 1);
                      }
                  }
              }
              else if (data[fieldName] != undefined) {//the field exist in the node data
                  data[fieldName] = value;
              }
              else if (value != "") {//the field does not exist in the node data, it is new field
                  data[fieldName] = value;
              }
          }
      }

      var that = this;
      this.obj._hideBeforeAnimation();
      OrgChart.anim(that.wrapperElement,
          { right: 0, opacity: 1 },
          { right: -150, opacity: 0 },
          300,
          OrgChart.anim.inOutSin,
          function () {
              that.obj._showAfterAnimation();
              that.obj.updateNode(data, null, true);
              that.obj.element.removeChild(that.wrapperElement);
              that.wrapperElement = null;
          }
      );
  }
  else {
      this.obj.element.removeChild(this.wrapperElement);
      this.wrapperElement = null;
  }
};


OrgChart.prototype.getSvg = function () {
  var svgElements = this.element.getElementsByTagName("svg");
  if (svgElements && svgElements.length) {
      return svgElements[0];
  }
  return null;
};

OrgChart.prototype.getPointerElement = function () {
  return this.element.querySelector("g[data-pointer]");
};

OrgChart.prototype.getNodeElement = function (id) {
  return this.element.querySelector("g[node-id='" + id + "']");
};

OrgChart.prototype.getExportMenuButton = function () {
  return this.element.querySelector("[control-export-menu]");
};




OrgChart.menuUI = function () {
};

OrgChart.menuUI.prototype.init = function (obj, menu) {
  this.obj = obj;
  this.wrapper = null;
  this.menu = menu;
  this._event_id = OrgChart._guid();
};


OrgChart.menuUI.prototype.showStickIn = function (stickToElement, firstNodeId, secondNodeId, menu) {         
  this._show(stickToElement, null, firstNodeId, secondNodeId, menu);
};

OrgChart.menuUI.prototype.show = function (x, y, firstNodeId, secondNodeId, menu) {   
  this._show(x, y, firstNodeId, secondNodeId, menu);
};

OrgChart.menuUI.prototype._show = function (x, y, firstNodeId, secondNodeId, menu) {    
  var that = this;
  this.hide();
  var html = "";

  if (!menu) {
      menu = this.menu;
  }
  
  var args = {
      firstNodeId: firstNodeId, 
      secondNodeId: secondNodeId, 
      menu: menu 
  };

  var result = OrgChart.events.publish('show', [this, args]);

  if (result === false) {
      return false;
  }

  menu = args.menu;

  for (var item in menu) {
      var icon = menu[item].icon;
      var text = menu[item].text;

      if (icon === undefined) {
          icon = OrgChart.icon[item](24, 24, "#7A7A7A");
      }

      if (typeof(text) == 'function'){
          text = text();
      }

      if (typeof(icon) == 'function'){
          icon = icon();
      }

      html += '<div data-item="' + item + '" style="border-bottom: 1px solid #D7D7D7; padding: 7px 10px;color: #7A7A7A;">' + icon + '<span>&nbsp;&nbsp;' + text + '</span></div>';
  }

  if (html != "") {
      this.wrapper = document.createElement("div");
      Object.assign(this.wrapper.style, {
          opacity: 0, "background-color": "#FFFEFF", "box-shadow": "#DCDCDC 0px 1px 2px 0px", display: "inline-block", border: "1px solid #D7D7D7;border-radius:5px", "z-index": 1000, position: "absolute", "text-align": "left", "user-select": "none"
      });

      this.wrapper.className = "chart-menu";


      this.wrapper.style.left = "-99999px";
      this.wrapper.style.top  = "-99999px";

      this.wrapper.innerHTML = html;
      this.obj.element.appendChild(this.wrapper);

      if (y == undefined){
          var position = OrgChart._menuPosition(x, this.wrapper, this.obj.getSvg());
          x = position.x;
          y = position.y;
      }


      var startLeft = x + 45;
 
      this.wrapper.style.left = startLeft + "px";
      this.wrapper.style.top = y + "px";

      this.wrapper.style.left = startLeft - this.wrapper.offsetWidth + "px";
      var endLeft = x - this.wrapper.offsetWidth;

      OrgChart.anim(
          this.wrapper,
          { opacity: 0, left: startLeft - this.wrapper.offsetWidth },
          { opacity: 1, left: endLeft },
          300, OrgChart.anim.inOutPow);

      var items = this.wrapper.getElementsByTagName("div");

      for (var i = 0; i < items.length; i++) {
          var item = items[i];
          item.addEventListener("mouseover", function () {
              this.style.backgroundColor = "#F0F0F0";
          });
          item.addEventListener("mouseleave", function () {
              this.style.backgroundColor = "#FFFFFF";
          });
          item.addEventListener("click", function (e) {                
              var item = this.getAttribute("data-item");
              var onClick = menu[item].onClick;
              var result;
              if (onClick === undefined) {
                  if (item === "add") {
                      var data = { id: that.obj.generateId(), pid: firstNodeId };
                      that.obj.addNode(data, null, true);
                  }
                  else if (item === "edit") {
                      var node = that.obj.getNode(firstNodeId);
                      that.obj.editUI.show(node.id);
                  }
                  else if (item === "details") {
                      var node = that.obj.getNode(firstNodeId);
                      that.obj.editUI.show(node.id, true);
                  }
                  else if (item === "remove") {
                      that.obj.removeNode(firstNodeId, null, true);
                  }
                  else if (item === "svg") {
                      that.obj.exportSVG({
                          filename: "OrgChart.svg", 
                          expandChildren: false, 
                          nodeId: firstNodeId
                      });
                  }
                  else if (item === "pdf") {
                      that.obj.exportPDF({
                          filename: "OrgChart.pdf", 
                          expandChildren: false, 
                          nodeId: firstNodeId
                      });
                  }
                  else if (item === "png") {
                      that.obj.exportPNG({
                          filename: "OrgChart.png", 
                          expandChildren: false, 
                          nodeId: firstNodeId
                      });
                  }
                  else if (item === "csv") {
                      that.obj.exportCSV();
                  }
                  else if (item === "xml") {
                      that.obj.exportXML();
                  }
              }
              else {
                  result = menu[item].onClick.call(that.obj, firstNodeId, secondNodeId);                    
              }
              if (result != false){
                  that.hide();
              }
          });
      }
  }
};

OrgChart.menuUI.prototype.hide = function () {
  if (this.wrapper != null) {
      this.obj.element.removeChild(this.wrapper);
      this.wrapper = null;
  }
};

OrgChart.menuUI.prototype.on = function(event, callback){
  OrgChart.events.on(event, callback, this._event_id);
  return this;
};


if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.idb = {
  version: 1,
  dbName: "orgchart",
  tableName: "orgchart-js",
  keyPath: "id"
};

//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

OrgChart.idb.db = null;

OrgChart.idb._open = function(callback){       
  if (OrgChart._browser().msie) {
      if (callback) callback(false);
      return;
  }

  if (navigator.userAgent.toLowerCase().indexOf("safari") > 0 || navigator.userAgent.toLowerCase().indexOf("firefox") > 0) {
      if (window.location !== window.parent.location) {
          if (callback) callback(false);
          return;
      } 
  }
  
  if (!window.indexedDB) {        
      console.error("Your browser doesn't support a stable version of IndexedDB.");
      if (callback) callback(false);
      return;
  }

  if (OrgChart.idb.db != null){
      if (callback) callback(true);
      return;
  }

  var req = indexedDB.open(OrgChart.idb.dbName, OrgChart.idb.version);

  req.onerror = function (event) {
      console.error("Cannot open database!");
      if (callback) callback(false);
  };

  req.onsuccess = function (event) {
      OrgChart.idb.db = event.target.result;
      if (callback) callback(true);
  };

  req.onupgradeneeded = function (event) {
      var db = event.target.result;

      if (db.objectStoreNames.contains(OrgChart.idb.tableName)) {
          db.deleteObjectStore(OrgChart.idb.tableName)
      }
      var objectStore = db.createObjectStore(OrgChart.idb.tableName, { keyPath: OrgChart.idb.keyPath });
  }
}

OrgChart.idb.read = function(id, callback){
  OrgChart.idb._open(function(success){
      if (success){
          var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName]);
          var objectStore = transaction.objectStore(OrgChart.idb.tableName);
          var req = objectStore.get(id);
      
          req.onerror = function (event) {                
              console.error("Unable to retrieve data from database!");
              if (callback) callback(false);
          };
      
          req.onsuccess = function (event) {
              if (req.result) {
                  if (callback) callback(true, req.result);
              } 
              else {
                  if (callback) callback(null);
              }
          };
      }
      else{
          if (callback) callback(false);
      }
  });
};


OrgChart.idb.write = function(row, callback){
  OrgChart.idb.read(row.id, function(success){
      if (success == null){
          var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
          var objectStore = transaction.objectStore(OrgChart.idb.tableName);
          var req = objectStore.add(row);
  
          req.onerror = function (event) {                
              console.error("Unable to add data to database!");
              if (callback) callback(false);
          };

          req.onsuccess = function (event) {
              if (callback) callback(true);
          };    
      }
      else {
          if (callback) callback(success);
      }
  });
};

OrgChart.idb.put = function(row, callback){
  OrgChart.idb._open(function(success){
      if (success){
          var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
          var objectStore = transaction.objectStore(OrgChart.idb.tableName);
          var req = objectStore.put(row);
      
          req.onerror = function (event) {                
              console.error("Unable to put data to database!");
              if (callback) callback(false);
          };        
      

          req.onsuccess = function (event) {
              if (callback) callback(true);
          };    
      }
      else{
          if (callback) callback(false);
      }
  });
};


OrgChart.idb.delete = function(id, callback){
  OrgChart.idb._open(function(success){
      if (success){
          var transaction = OrgChart.idb.db.transaction([OrgChart.idb.tableName], "readwrite");
          var objectStore = transaction.objectStore(OrgChart.idb.tableName);
          var req = objectStore.delete(id);
      
          req.onerror = function (event) {                
              console.error("Unable to retrieve data from database!");
              if (callback) callback(false);
          };
      
          req.onsuccess = function (event) {
              if (!req.error) {
                  if (callback) callback(true);
              } 
              else {
                  if (callback) callback(false);
              }
          };
      }
      else{
          if (callback) callback(false);
      }
  });
};



OrgChart.toolbarUI = function () {
};

OrgChart.toolbarUI.expandAllIcon = '<svg style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#757575" /></marker><line x1="11" y1="11" x2="6" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="11" x2="26" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="21" x2="26" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="11" y1="21" x2="6" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><rect x="12" y="12" width="8" height="8" fill="#757575"></rect></svg>';
OrgChart.toolbarUI.fitIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><circle cx="16" cy="16" r="5" fill="#757575"></circle></svg>';
OrgChart.toolbarUI.openFullScreenIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><line x1="5" y1="5" x2="27" y2="27" stroke-width="3" stroke="#757575"></line><line x1="5" y1="27" x2="27" y2="5" stroke-width="3" stroke="#757575"></line></svg>';
OrgChart.toolbarUI.closeFullScreenIcon = '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><rect x="11" y="11" width="10" height="10" stroke-width="3" fill="none" stroke="#757575" ></rect></svg>';
OrgChart.toolbarUI.zoomInIcon = '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-top: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line><line x1="16" y1="8" x2="16" y2="24" stroke-width="3" stroke="#757575"></line></g><line x1="4" y1="32" x2="28" y2="32" stroke-width="1" stroke="#cacaca"></line></svg>';
OrgChart.toolbarUI.zoomOutIcon = '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); margin-bottom:7px; border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-bottom: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line></g></svg>';
OrgChart.toolbarUI.layoutIcon = '<svg data-tlbr="layout" style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M8,24 L16,14 L24,24"></path><path stroke-width="3" fill="none" stroke="#757575" d="M8,16 L16,8 L24,16"></path></svg>';

OrgChart.toolbarUI.prototype.init = function (obj, toolbar) {
  if (!toolbar){
      return;
  }
  this.obj = obj;
  this.toolbar = toolbar;

  this._visible = false;
  this.div = document.createElement("div");
  this.div.classList.add('bg-toolbar-container');
  Object.assign(this.div.style, {
      position: "absolute", padding: "3px", right: this.obj.config.padding + "px", bottom: this.obj.config.padding + "px"
  });

  if (toolbar.expandAll){
      this.div.innerHTML += '<div data-tlbr="expand">' + OrgChart.toolbarUI.expandAllIcon + '</div>';
  }
  if (toolbar.fit){
      this.div.innerHTML += '<div data-tlbr="fit">' + OrgChart.toolbarUI.fitIcon + '</div>';
  }
  if (toolbar.zoom){
      this.div.innerHTML += '<div data-tlbr="plus">' + OrgChart.toolbarUI.zoomInIcon + '</div>';
      this.div.innerHTML += '<div data-tlbr="minus">' + OrgChart.toolbarUI.zoomOutIcon + '</div>';
  }
  if (toolbar.layout){
      this.div.innerHTML += '<div data-tlbr="layout">' + OrgChart.toolbarUI.layoutIcon + '</div>';

      this.layouts = document.createElement("div");


      this.layouts.innerHTML =
          '<svg data-layout="normal" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="88" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="32" y1="35" y2="41" stroke-width="1"></line><line stroke="#000000" x1="88" x2="88" y1="35" y2="41" stroke-width="1"></line></svg>'
          + '<svg data-layout="treeRightOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="35" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="35" x2="35" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="54" y2="54" stroke-width="1"></line></svg>'
          + '<svg data-layout="treeLeftOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="85" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="85" x2="85" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="54" y2="54" stroke-width="1"></line></svg>'
          + '<svg data-layout="mixed" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="41" stroke-width="1"></line><line stroke="#000000" x1="60" x2="60" y1="68" y2="73" stroke-width="1"></line></svg>'
          + '<svg data-layout="tree" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="73" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="86" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="54" y2="54" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="86" y2="86" stroke-width="1"></line></svg>';
      this.obj.element.appendChild(this.layouts);
      Object.assign(this.layouts.style, {
          position: "absolute", width: "100%", left: "0", bottom: "-145px", "box-shadow": "0px 1px 4px rgba(0,0,0,0.3)", "background-color": "#f9f9f9", height: "123px", "padding-top": "20px", "border-top": "1px solid #cacaca"
      });
  }
  if (toolbar.fullScreen){
      this.div.innerHTML += '<div data-tlbr="fullScreen">' + OrgChart.toolbarUI.openFullScreenIcon + '</div>';
  }

  this.obj.element.appendChild(this.div);

  this.layoutBtn = this.div.querySelector('[data-tlbr="layout"]');
  var plusBtn = this.div.querySelector('[data-tlbr="plus"]');
  var minusBtn = this.div.querySelector('[data-tlbr="minus"]');
  var fitBtn = this.div.querySelector('[data-tlbr="fit"]');
  var fullScreenBtn = this.div.querySelector('[data-tlbr="fullScreen"]');
  var expandBtn = this.div.querySelector('[data-tlbr="expand"]');

  
  var that = this;
  if (plusBtn){
      plusBtn.addEventListener("click", function () {
          that.obj.zoom(true, null, true);
      });
  }

  if (minusBtn){
      minusBtn.addEventListener("click", function () {
          that.obj.zoom(false, null, true);
      });
  }

  if (fitBtn){
      fitBtn.addEventListener("click", function () {
          that.obj.fit();
      });
  }

  if (fullScreenBtn){
      fullScreenBtn.addEventListener("click", function () {
          that.obj.toggleFullScreen();
      });
  }


  if (expandBtn){
      expandBtn.addEventListener("click", function () {
          that.obj.expand(null, "all");
      });
  }


  if (this.layoutBtn){
      this.layoutBtn.addEventListener("click", function () {
          if (that._visible) {
              that.hideLayout();
          }
          else {
              that.showLayout();
          }
      });
  }


  if (this.layouts){
      this.layouts.addEventListener("click", function (e) {
          var l = e.target;

  
          while (l) {
              if (l.hasAttribute && l.hasAttribute("data-layout")) {
                  l = l.getAttribute("data-layout");
                  that.obj.setLayout(OrgChart[l]);
                  break;
              }
              l = l.parentNode;
          }
      });
  }
};

OrgChart.toolbarUI.prototype.showLayout = function () {
  this._visible = true;


  this.layoutBtn.style.transform = "rotate(180deg) translateX(0px) translateY(0px)";
  
  OrgChart.anim(this.div,
      { bottom: this.obj.config.padding },
      { bottom: this.obj.config.padding + 145 },
      this.obj.config.anim.duration,
      this.obj.config.anim.func
  );

  OrgChart.anim(this.layouts,
      { bottom: -145 },
      { bottom: 0 },
      this.obj.config.anim.duration,
      this.obj.config.anim.func
  );
};

OrgChart.toolbarUI.prototype.hideLayout = function () {
  this._visible = false;
  this.layoutBtn.style.transform = "rotate(0deg) translateX(0px) translateY(0px)";

  OrgChart.anim(this.div,
      { bottom: this.obj.config.padding + 145},
      { bottom: this.obj.config.padding  },
      this.obj.config.anim.duration,
      this.obj.config.anim.func
  );

  OrgChart.anim(this.layouts,
      { bottom: 0},
      { bottom: -145  },
      this.obj.config.anim.duration,
      this.obj.config.anim.func
  );
};


OrgChart.notifierUI = function () {
};

OrgChart.notifierUI.prototype.init = function (obj) {    
  this.obj = obj;   
};

OrgChart.notifierUI.prototype.show = function (message, color) {
  if (message == undefined){
      return;
  }
  if (message == 1){
      message = OrgChart.MAX_NODES_MESS;
      color = "#FFCA28";
  }    

  if (message == 2){
      message = OrgChart.OFFLINE_MESS;
      color = "#FFCA28";
  }  

  
  var div = document.createElement("div");
  div.innerHTML = message;
  
  Object.assign(div.style, {
      position: "absolute", "background-color": color, color: "#ffffff", padding: "15px", "border-radius": "40px", opacity: 0, "overflow": "hidden", "white-space": "nowrap", "text-align": "center"
  });

  this.obj.element.appendChild(div);
  
  var left = ((this.obj.width() / 2) - (div.offsetWidth / 2));
  var top = ((this.obj.height() / 2) - (div.offsetHeight / 2));
  div.style.left = left + "px";
  div.style.top = top + "px";
  var orWidth = div.offsetWidth;
  div.style.width = "20px";
  OrgChart.anim(div, {opacity: 0, width: 10}, {opacity: 1, width: orWidth}, this.obj.config.anim.duration, this.obj.config.anim.func);
};




OrgChart.icon = {};

OrgChart.icon.png = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
      + '<path fill="' + c + '" d="M146.747,276.708c0-13.998-9.711-22.352-26.887-22.352c-6.99,0-11.726,0.675-14.204,1.355v44.927 c2.932,0.676,6.539,0.896,11.52,0.896C135.449,301.546,146.747,292.28,146.747,276.708z"/>'
      + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M234.344,335.86v45.831h-31.601V229.524h40.184 l31.611,55.759c9.025,16.031,18.064,34.983,24.825,52.154h0.675c-2.257-20.103-2.933-40.643-2.933-63.44v-44.473h31.614v152.167 h-36.117l-32.516-58.703c-9.049-16.253-18.971-35.892-26.438-53.727l-0.665,0.222C233.906,289.58,234.344,311.027,234.344,335.86z M71.556,381.691V231.56c10.613-1.804,25.516-3.159,46.506-3.159c21.215,0,36.353,4.061,46.509,12.192 c9.698,7.673,16.255,20.313,16.255,35.219c0,14.897-4.959,27.549-13.999,36.123c-11.738,11.063-29.123,16.031-49.441,16.031 c-4.522,0-8.593-0.231-11.736-0.675v54.411H71.556V381.691z M453.601,523.353H97.2V419.302h356.4V523.353z M485.652,374.688 c-10.61,3.607-30.713,8.585-50.805,8.585c-27.759,0-47.872-7.003-61.857-20.545c-13.995-13.1-21.684-32.97-21.452-55.318 c0.222-50.569,37.03-79.463,86.917-79.463c19.644,0,34.783,3.829,42.219,7.446l-7.214,27.543c-8.369-3.617-18.752-6.55-35.458-6.55 c-28.656,0-50.341,16.256-50.341,49.22c0,31.382,19.649,49.892,47.872,49.892c7.895,0,14.218-0.901,16.934-2.257v-31.835h-23.493 v-26.869h56.679V374.688z"/>'
      + '</svg>';
};

OrgChart.icon.pdf = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
      + '<path fill="' + c + '" d="M160.381,282.225c0-14.832-10.299-23.684-28.474-23.684c-7.414,0-12.437,0.715-15.071,1.432V307.6 c3.114,0.707,6.942,0.949,12.192,0.949C148.419,308.549,160.381,298.74,160.381,282.225z"/>'
      + '<path fill="' + c + '" d="M272.875,259.019c-8.145,0-13.397,0.717-16.519,1.435v105.523c3.116,0.729,8.142,0.729,12.69,0.729 c33.017,0.231,54.554-17.946,54.554-56.474C323.842,276.719,304.215,259.019,272.875,259.019z"/>'
      + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M362.359,309.023c0,30.876-11.243,52.165-26.82,65.333 c-16.971,14.117-42.82,20.814-74.396,20.814c-18.9,0-32.297-1.197-41.401-2.389V234.365c13.399-2.149,30.878-3.346,49.304-3.346 c30.612,0,50.478,5.508,66.039,17.226C351.828,260.69,362.359,280.547,362.359,309.023z M80.7,393.499V234.365 c11.241-1.904,27.042-3.346,49.296-3.346c22.491,0,38.527,4.308,49.291,12.928c10.292,8.131,17.215,21.534,17.215,37.328 c0,15.799-5.25,29.198-14.829,38.285c-12.442,11.728-30.865,16.996-52.407,16.996c-4.778,0-9.1-0.243-12.435-0.723v57.67H80.7 V393.499z M453.601,523.353H97.2V419.302h356.4V523.353z M484.898,262.127h-61.989v36.851h57.913v29.674h-57.913v64.848h-36.593 V232.216h98.582V262.127z"/>'
  + '</svg>';
};

OrgChart.icon.svg = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801">'
      + '<path fill="' + c + '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M338.871,225.672L284.545,386.96h-42.591 l-51.69-161.288h39.967l19.617,68.196c5.508,19.143,10.531,37.567,14.36,57.67h0.717c4.061-19.385,9.089-38.527,14.592-56.953 l20.585-68.918h38.77V225.672z M68.458,379.54l7.415-30.153c9.811,5.021,24.888,10.051,40.439,10.051 c16.751,0,25.607-6.935,25.607-17.465c0-10.052-7.662-15.795-27.05-22.734c-26.8-9.328-44.263-24.168-44.263-47.611 c0-27.524,22.971-48.579,61.014-48.579c18.188,0,31.591,3.823,41.159,8.131l-8.126,29.437c-6.465-3.116-17.945-7.657-33.745-7.657 c-15.791,0-23.454,7.183-23.454,15.552c0,10.296,9.089,14.842,29.917,22.731c28.468,10.536,41.871,25.365,41.871,48.094 c0,27.042-20.812,50.013-65.09,50.013C95.731,389.349,77.538,384.571,68.458,379.54z M453.601,523.353H97.2V419.302h356.4V523.353z M488.911,379.54c-11.243,3.823-32.537,9.103-53.831,9.103c-29.437,0-50.73-7.426-65.57-21.779 c-14.839-13.875-22.971-34.942-22.738-58.625c0.253-53.604,39.255-84.235,92.137-84.235c20.81,0,36.852,4.073,44.74,7.896 l-7.657,29.202c-8.859-3.829-19.849-6.95-37.567-6.95c-30.396,0-53.357,17.233-53.357,52.173c0,33.265,20.81,52.882,50.73,52.882 c8.375,0,15.072-0.96,17.94-2.395v-33.745h-24.875v-28.471h60.049V379.54L488.911,379.54z" />'
      + '</svg>';
};

OrgChart.icon.csv = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 548.29 548.291" >'
   + '<path fill="' + c + '" d="M486.2,196.121h-13.164V132.59c0-0.399-0.064-0.795-0.116-1.2c-0.021-2.52-0.824-5-2.551-6.96L364.656,3.677 c-0.031-0.034-0.064-0.044-0.085-0.075c-0.629-0.707-1.364-1.292-2.141-1.796c-0.231-0.157-0.462-0.286-0.704-0.419 c-0.672-0.365-1.386-0.672-2.121-0.893c-0.199-0.052-0.377-0.134-0.576-0.188C358.229,0.118,357.4,0,356.562,0H96.757 C84.893,0,75.256,9.649,75.256,21.502v174.613H62.093c-16.972,0-30.733,13.756-30.733,30.73v159.81 c0,16.966,13.761,30.736,30.733,30.736h13.163V526.79c0,11.854,9.637,21.501,21.501,21.501h354.777 c11.853,0,21.502-9.647,21.502-21.501V417.392H486.2c16.966,0,30.729-13.764,30.729-30.731v-159.81 C516.93,209.872,503.166,196.121,486.2,196.121z M96.757,21.502h249.053v110.006c0,5.94,4.818,10.751,10.751,10.751h94.973v53.861 H96.757V21.502z M258.618,313.18c-26.68-9.291-44.063-24.053-44.063-47.389c0-27.404,22.861-48.368,60.733-48.368 c18.107,0,31.447,3.811,40.968,8.107l-8.09,29.3c-6.43-3.107-17.862-7.632-33.59-7.632c-15.717,0-23.339,7.149-23.339,15.485 c0,10.247,9.047,14.769,29.78,22.632c28.341,10.479,41.681,25.239,41.681,47.874c0,26.909-20.721,49.786-64.792,49.786 c-18.338,0-36.449-4.776-45.497-9.77l7.38-30.016c9.772,5.014,24.775,10.006,40.264,10.006c16.671,0,25.488-6.908,25.488-17.396 C285.536,325.789,277.909,320.078,258.618,313.18z M69.474,302.692c0-54.781,39.074-85.269,87.654-85.269 c18.822,0,33.113,3.811,39.549,7.149l-7.392,28.816c-7.38-3.084-17.632-5.939-30.491-5.939c-28.822,0-51.206,17.375-51.206,53.099 c0,32.158,19.051,52.4,51.456,52.4c10.947,0,23.097-2.378,30.241-5.238l5.483,28.346c-6.672,3.34-21.674,6.919-41.208,6.919 C98.06,382.976,69.474,348.424,69.474,302.692z M451.534,520.962H96.757v-103.57h354.777V520.962z M427.518,380.583h-42.399 l-51.45-160.536h39.787l19.526,67.894c5.479,19.046,10.479,37.386,14.299,57.397h0.709c4.048-19.298,9.045-38.352,14.526-56.693 l20.487-68.598h38.599L427.518,380.583z" />'
      + '</svg>';
};

OrgChart.icon.excel = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
      + '<path fill="#ECEFF1" d="M496,432.011H272c-8.832,0-16-7.168-16-16s0-311.168,0-320s7.168-16,16-16h224 c8.832,0,16,7.168,16,16v320C512,424.843,504.832,432.011,496,432.011z" />'
      + '<path fill="' + c + '" d="M336,176.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,176.011,336,176.011z" />'
      + '<path fill="' + c + '" d="M336,240.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,240.011,336,240.011z" />'
      + '<path fill="' + c + '" d="M336,304.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,304.011,336,304.011z" />'
      + '<path fill="' + c + '" d="M336,368.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,368.011,336,368.011z" />'
      + '<path fill="' + c + '" d="M432,176.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,176.011,432,176.011z" />'
      + '<path fill="' + c + '" d="M432,240.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,240.011,432,240.011z" />'
      + '<path fill="' + c + '" d="M432,304.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,304.011,432,304.011z" />'
      + '<path fill="' + c + '" d="M432,368.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,368.011,432,368.011z" />'
      + '<path fill="' + c + '"  d="M282.208,19.691c-3.648-3.04-8.544-4.352-13.152-3.392l-256,48C5.472,65.707,0,72.299,0,80.011v352 c0,7.68,5.472,14.304,13.056,15.712l256,48c0.96,0.192,1.952,0.288,2.944,0.288c3.712,0,7.328-1.28,10.208-3.68 c3.68-3.04,5.792-7.584,5.792-12.32v-448C288,27.243,285.888,22.731,282.208,19.691z" />'
      + '<path fill="#FAFAFA" d="M220.032,309.483l-50.592-57.824l51.168-65.792c5.44-6.976,4.16-17.024-2.784-22.464 c-6.944-5.44-16.992-4.16-22.464,2.784l-47.392,60.928l-39.936-45.632c-5.856-6.72-15.968-7.328-22.56-1.504 c-6.656,5.824-7.328,15.936-1.504,22.56l44,50.304L83.36,310.187c-5.44,6.976-4.16,17.024,2.784,22.464 c2.944,2.272,6.432,3.36,9.856,3.36c4.768,0,9.472-2.112,12.64-6.176l40.8-52.48l46.528,53.152 c3.168,3.648,7.584,5.504,12.032,5.504c3.744,0,7.488-1.312,10.528-3.968C225.184,326.219,225.856,316.107,220.032,309.483z" />'
      + '</svg>';
};


OrgChart.icon.edit = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 528.899 528.899">'
      + '<path fill="' + c + '" d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />'
      + '</svg>';
};

OrgChart.icon.details = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 512 512">'
      + '<path fill="' + c + '" d="M447.933,103.629c-0.034-3.076-1.224-6.09-3.485-8.352L352.683,3.511c-0.004-0.004-0.007-0.005-0.011-0.008 C350.505,1.338,347.511,0,344.206,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237 h333.444c13.916,0,25.237-11.32,25.237-25.237V103.753C447.96,103.709,447.937,103.672,447.933,103.629z M356.194,40.931 l50.834,50.834h-49.572c-0.695,0-1.262-0.567-1.262-1.262V40.931z M423.983,486.763c0,0.695-0.566,1.261-1.261,1.261H89.278 c-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h242.94v66.527c0,13.916,11.322,25.239,25.239,25.239 h66.527V486.763z"/>'
      + '<path fill="' + c + '" d="M362.088,164.014H149.912c-6.62,0-11.988,5.367-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,169.381,368.707,164.014,362.088,164.014z"/>'
      + '<path fill="' + c + '" d="M362.088,236.353H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,241.721,368.707,236.353,362.088,236.353z"/>'
      + '<path fill="' + c + '" d="M362.088,308.691H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.367,11.988-11.988C374.076,314.06,368.707,308.691,362.088,308.691z"/>'
      + '<path fill="' + c + '" d="M256,381.031H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988H256 c6.62,0,11.988-5.367,11.988-11.988C267.988,386.398,262.62,381.031,256,381.031z"/>'
      + '</svg>';
};

OrgChart.icon.remove = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '"  viewBox="0 0 900.5 900.5">'
      + '<path fill="' + c + '" d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"/>'
      + '<path fill="' + c + '" d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874 c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576 c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"/>'
      + '</svg>';
};

OrgChart.icon.add = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '"   viewBox="0 0 922 922">'
      + '<path fill="' + c + '" d="M922,453V81c0-11.046-8.954-20-20-20H410c-11.045,0-20,8.954-20,20v149h318c24.812,0,45,20.187,45,45v198h149 C913.046,473.001,922,464.046,922,453z" />'
      + '<path fill="' + c + '" d="M557,667.001h151c11.046,0,20-8.954,20-20v-174v-198c0-11.046-8.954-20-20-20H390H216c-11.045,0-20,8.954-20,20v149h194 h122c24.812,0,45,20.187,45,45v4V667.001z" />'
      + '<path fill="' + c + '" d="M0,469v372c0,11.046,8.955,20,20,20h492c11.046,0,20-8.954,20-20V692v-12.501V667V473v-4c0-11.046-8.954-20-20-20H390H196 h-12.5H171H20C8.955,449,0,457.955,0,469z" />'
      + '</svg>';
};


OrgChart.icon.search = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.213 485.213">'
      + '<path fill="' + c + '" d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324 c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z" />'
      + '<path fill="' + c + '" d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951 C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46 c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465 C318.424,257.208,257.206,318.416,181.956,318.416z" />'
      + '<path fill="' + c + '" d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" />'
      + '</svg>';
};



OrgChart.icon.xml = function (w, h, c) {
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 550.801 550.801"><path fill="' + c + '"  d="M488.426,197.019H475.2v-63.816c0-0.401-0.063-0.799-0.116-1.205c-0.021-2.534-0.827-5.023-2.562-6.992L366.325,3.691 c-0.032-0.031-0.063-0.042-0.085-0.073c-0.633-0.707-1.371-1.298-2.151-1.804c-0.231-0.158-0.464-0.287-0.706-0.422 c-0.676-0.366-1.393-0.675-2.131-0.896c-0.2-0.053-0.38-0.135-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.87v160.542 c0,17.044,13.824,30.876,30.873,30.876h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87V227.89C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.51c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M369.531,374.53h-32.058l-2.156-55.519 c-0.644-17.434-1.298-38.518-1.298-59.611h-0.633c-4.514,18.516-10.547,39.166-16.137,56.162l-17.645,56.601h-25.618 l-15.494-56.157c-4.725-16.996-9.671-37.658-13.123-56.6h-0.43c-0.854,19.585-1.508,41.961-2.586,60.038l-2.576,55.086h-30.343 l9.26-145.035h43.677l14.207,48.421c4.517,16.774,9.041,34.847,12.258,51.843h0.654c4.081-16.77,9.038-35.923,13.774-52.064 l15.493-48.199h42.82L369.531,374.53z M69.992,374.53l41.955-73.385l-40.444-71.65h37.655l12.688,26.465 c4.316,8.828,7.533,15.928,10.99,24.092h0.422c3.438-9.242,6.23-15.694,9.893-24.092l12.274-26.465h37.434l-40.89,70.796 l43.044,74.239h-37.866l-13.134-26.257c-5.376-10.108-8.817-17.639-12.909-26.04h-0.433c-3.009,8.401-6.674,15.932-11.19,26.04 l-12.042,26.257H69.992z M453.601,523.353H97.2V419.302h356.4V523.353z M485.325,374.53h-90.608V229.495h32.933v117.497h57.682 v27.538H485.325z"/></svg>';
};









OrgChart.prototype.exportPDF = function (options, callback) {
  options = this._defaultExportOptions(options, 'pdf');
  this._export(options, callback);
};


OrgChart.prototype.exportPNG = function (options, callback) {
  options = this._defaultExportOptions(options, 'png');
  this._export(options, callback);
};

OrgChart.prototype.exportSVG = function (options, callback) {
  options = this._defaultExportOptions(options, 'svg');
  this._export(options, callback);
};

OrgChart.prototype._defaultExportOptions = function (options, type) {
  if (options == undefined) {
      options = {};
  }
  if (type == 'svg') {
      options.ext = "svg";
      options.mime = "image/svg+xml";
  }
  else if (type == 'pdf') {
      options.mime = "application/pdf";
      options.ext = 'pdf';
  }
  else if (type == 'png') {
      options.mime = "image/png";
      options.ext = 'png';
  }
  if (options.margin == undefined) {
      options.margin = [50, 40, 50, 40];
  }
  if (options.padding == undefined) {
      options.padding = 0;
  }
  if (options.landscape == undefined) {
      options.landscape = false;
  }
  if (options.filename == undefined) {
      options.filename = "OrgChart." + options.ext;
  }
  if (options.scale == undefined) {
      options.scale = 'fit';
  }
  if (options.format == undefined) {
      options.format = 'fit';
  }
  if (options.header == undefined) {
      options.header = '';
  }
  if (options.footer == undefined) {
      options.footer = 'Page {current-page} of {total-pages}';
  }
  if (options.openInNewTab == undefined) {
      options.openInNewTab = false;
  }

  return options;
};


OrgChart.prototype._export = function (options, callback) {
  var that = this;

  var params = {
      id: options.nodeId,
      expandChildren: options.expandChildren
  };

  if (options.margin && options.margin[0] < 2){
      options.margin[0] = 2;
  }
  if (options.margin && options.margin[1] < 2){
      options.margin[1] = 2;
  }
  if (options.margin && options.margin[2] < 2){
      options.margin[2] = 2;
  }
  if (options.margin && options.margin[3] < 2){
      options.margin[3] = 2;
  }

  this._draw(false, OrgChart.action.exporting, params, function (content) {
      var el = document.createElement('div');
      el.innerHTML = content;

      if (options.padding > 0){
          var svg = el.querySelector('svg');
          var vb = OrgChart._getViewBox(svg);
          vb[0] -= options.padding;
          vb[1] -= options.padding;
          vb[2] += options.padding * 2;
          vb[3] += options.padding * 2;
          
          svg.setAttribute('viewBox', vb.join());
          svg.setAttribute('width', vb[2]);
          svg.setAttribute('height', vb[3]);
      }

      if (options.ext == "svg") {
          if (!callback) {                
              var args = { content: el.innerHTML, options: options, styles: "" };
              var result = OrgChart.events.publish('exportstart', [that, args]);                

              if (args.styles){                    
                  //todo: refactor it
                  el.childNodes[0].insertAdjacentHTML("afterbegin", args.styles);
                  args.content = el.innerHTML;
              }

              if (result === false) {
                  return false;
              }
              OrgChart._downloadFile(options.mime, args.content, args.options.filename, args.options.openInNewTab);
              result = OrgChart.events.publish('exportend', [that, args]);
              if (result === false) {
                  return false;
              }
          }
          else {
              callback(options, el.innerHTML)
          }
      }
      else {
          //OrgChart._imgs2base64(el, "image", "xlink:href", function () {
              that._pages(options, el.querySelector('svg'), function(pages){
                  var content = el.innerHTML;
                  var req = { content: content, options: options, pages: pages, styles: "" };
  
                  var result = OrgChart.events.publish('exportstart', [that, req]);
                  if (result === false) {
                      return false;
                  }
                  if (!callback) {
                      OrgChart.loading.show(that);
                  }    
  
                  if (!callback) {
                      req = JSON.stringify(req);
                      OrgChart._ajax(that.config.exportUrl + "/v3", "POST", req, "arraybuffer", function (response) {
                          var result = OrgChart.events.publish('exportend', [that, response]);
  
                          if (result === false) {
                              return false;
                          }
                          OrgChart.loading.hide(that);
  
                          OrgChart._downloadFile(options.mime, response, options.filename, options.openInNewTab);
                      });
                  }
                  else {
                      callback(that, req, el.querySelector('svg'));
                  }
              });
          //});
      }
  });
};

OrgChart.prototype.exportCSV = function (filename) {
  if (!filename) {
      filename = "OrgChart.csv";
  }

  var nodes = JSON.parse(JSON.stringify(this.config.nodes));

  var startArgs = {
      ext: "csv",
      filename: filename,
      nodes: nodes
  };
  var result = OrgChart.events.publish('exportstart', [this, startArgs]);

  if (result === false) {
      return false;
  }

  var csv = OrgChart._json2csv(startArgs.nodes);

  var endArgs = {
      ext: startArgs.ext,
      filename: startArgs.filename,
      nodes: startArgs.nodes,
      content: csv
  };

  var result = OrgChart.events.publish('exportend', [this, endArgs]);

  if (result === false) {
      return false;
  }

  OrgChart._downloadFile('text/csv;charset=utf-8;', '\uFEFF' + endArgs.content, endArgs.filename, endArgs.openInNewTab);
};

OrgChart.prototype.exportXML = function (filename) {
  if (!filename) {
      filename = "OrgChart.xml";
  }

  var nodes = JSON.parse(JSON.stringify(this.config.nodes));

  var startArgs = {
      ext: "xml",
      filename: filename,
      nodes: nodes
  };

  var result = OrgChart.events.publish('exportstart', [this, startArgs]);

  if (result === false) {
      return false;
  }

  var xml = OrgChart._json2xml(startArgs.nodes);

  var endArgs = {
      ext: startArgs.ext,
      filename: startArgs.filename,
      nodes: startArgs.nodes,
      content: xml
  };

  var result = OrgChart.events.publish('exportend', [this, endArgs]);

  if (result === false) {
      return false;
  }

  OrgChart._downloadFile('application/xml', endArgs.content, endArgs.filename, endArgs.openInNewTab);
};



OrgChart.prototype._pages = function (opt, svg, callback) {
  if ((opt.format == 'A4' && opt.scale != 'fit') 
      || (opt.format == 'A3' && opt.scale != 'fit')
      || (opt.format == 'A2' && opt.scale != 'fit')
      || (opt.format == 'A1' && opt.scale != 'fit')
      || (opt.format == 'Letter' && opt.scale != 'fit')
      || (opt.format == 'Legal' && opt.scale != 'fit')) {
      callback(this._pagesA100(opt, svg, opt.scale));
  }
  else if ((opt.format == 'A4' && opt.scale == 'fit') 
      || (opt.format == 'A3' && opt.scale == 'fit')
      || (opt.format == 'A2' && opt.scale == 'fit')
      || (opt.format == 'A1' && opt.scale == 'fit')
      || (opt.format == 'Letter' && opt.scale == 'fit')
      || (opt.format == 'Legal' && opt.scale == 'fit')) {
      callback(this._pagesAfit(opt, svg));
  }
  else if (opt.format == 'fit') {
      callback(this._pagesFit(opt, svg));
  }
};


OrgChart.prototype._pagesFit = function (opt, svg) {
  var width = svg.getAttribute('width');
  var height = svg.getAttribute('height');

  var vb = OrgChart._getViewBox(svg);


  var innerSize = {
      w: parseFloat(width),
      h: parseFloat(height)
  };

  var size = {
      w: innerSize.w + (opt.margin[1] + opt.margin[3]),
      h: innerSize.h + (opt.margin[0] + opt.margin[2])
  }

  var pages = [{ vb: vb, size: size, innerSize: innerSize }];


  return pages;
}

OrgChart.prototype._pagesAfit = function (opt, svg) {
  var width = svg.getAttribute('width');

  var Aw = 0;
  var Ah = 0;

  switch  (opt.format){
      case 'A4':
              Aw = OrgChart.A4w;
              Ah = OrgChart.A4h;
          break;
      case 'A3':
              Aw = OrgChart.A3w;
              Ah = OrgChart.A3h;
              break;
      case 'A2':
              Aw = OrgChart.A2w;
              Ah = OrgChart.A2h;   
              break;
      case 'A1':
              Aw = OrgChart.A1w;
              Ah = OrgChart.A1h;             
          break; 
      case 'Letter':
              Aw = OrgChart.Letterw;
              Ah = OrgChart.Letterh;             
          break;               
      case 'Legal':
              Aw = OrgChart.Legalw;
              Ah = OrgChart.Legalh;             
          break;          
  }

  var innerSize = {
      w: opt.landscape ? Ah - (opt.margin[1] + opt.margin[3]) : Aw - (opt.margin[1] + opt.margin[3]),
      h: opt.landscape ? Aw - (opt.margin[0] + opt.margin[2]) : Ah - (opt.margin[0] + opt.margin[2])
  }

  var ratioW = innerSize.w /width ;
  var ratio = ratioW;

  return this._pagesA100(opt, svg, ratio * 100);
}

OrgChart.prototype._pagesA100 = function (opt, svg, scale) {
  var vb = OrgChart._getViewBox(svg);

  var Aw = 0;
  var Ah = 0;

  switch  (opt.format){
      case 'A4':
              Aw = OrgChart.A4w;
              Ah = OrgChart.A4h;
          break;
      case 'A3':
              Aw = OrgChart.A3w;
              Ah = OrgChart.A3h;
          break;
      case 'A2':
              Aw = OrgChart.A2w;
              Ah = OrgChart.A2h;   
          break;
      case 'A1':
              Aw = OrgChart.A1w;
              Ah = OrgChart.A1h;             
          break;   
      case 'Letter':
              Aw = OrgChart.Letterw;
              Ah = OrgChart.Letterh;             
          break;               
      case 'Legal':
              Aw = OrgChart.Legalw;
              Ah = OrgChart.Legalh;             
          break;                      
  }

  var vx = vb[0];
  var vy = vb[1];
  var vw = vb[2];
  var vh = vb[3];
  
  var innerSize = {
      w: opt.landscape ? Ah - (opt.margin[1] + opt.margin[3]) : Aw - (opt.margin[1] + opt.margin[3]),
      h: opt.landscape ? Aw - (opt.margin[0] + opt.margin[2]) : Ah - (opt.margin[0] + opt.margin[2]) 
  };
  var size = {
      w: opt.landscape ? Ah : Aw,
      h: opt.landscape ? Aw : Ah
  };
  svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');
  svg.setAttribute('width', innerSize.w);
  svg.setAttribute('height', innerSize.h); 


  var vwidth = innerSize.w * (100 / scale);//if change test exp/export.html
  var vheight = innerSize.h * (100 / scale);

  var temp_vx = vx;    
  var temp_vy = vy;

  var pages = [];
  while (temp_vx < vw + vx) { //it was temp_vx < vw we need temp_vx < vw - 1 becouse we have rounded numbers
      while (temp_vy < vh + vy) { //it was temp_vy < vh we need temp_vy < vh - 1 becouse we have rounded numbers
          //var xview = temp_vx + vwidth;
          
          var viewbox = [temp_vx, temp_vy, vwidth, vheight];
          viewbox = viewbox.join();
          pages.push({ vb: viewbox, innerSize: innerSize, size: size });
          temp_vy += vheight; //if change test exp/export.html
      }
      temp_vx += vwidth;
      temp_vy = vy ;
  }

  return pages;
}
if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.events = (function () {
  var topics = {};

  return {
      on: function (topic, listener, event_id) {
          if (!Array.isArray(topics[topic])){
              topics[topic] = [];
          }

          topics[topic].push({
              listener: listener,
              event_id: event_id
          });           
      },
      removeAll: function (topic) {
          if (!Array.isArray(topics[topic])){
              topics[topic] = [];
          }

          topics[topic] = [];         
      },
      removeForEventId: function (event_id) {
          for (var topic in topics){
              if (Array.isArray(topics[topic])){
                  for (var i = topics[topic].length - 1; i >= 0; i-- ){
                      if (topics[topic][i].event_id == event_id){
                          topics[topic].splice(i, 1);
                      }
                  }
              }
          }
      },
      publish: function (topic, info) {                        
          if (topics[topic]){                         
              var listeners = [];       
              for(var i = 0; i < topics[topic].length; i++){
                  var item = topics[topic][i];
                  if (item.event_id == undefined || item.event_id == info[0]._event_id){
                      listeners.push(item.listener);
                  }                  
              }

              if (listeners.length > 0){
                  var result = true;
                  for(var i = 0; i < listeners.length; i++){
                      if (info.length == 1){
                          result = listeners[i](info[0]) && result ;
                      }
                      else if (info.length == 2){
                          result = listeners[i](info[0], info[1]) && result;
                      }
                      else if (info.length == 3){
                          result = listeners[i](info[0], info[1], info[2]) && result;
                      }
                      else if (info.length == 4){
                          result = listeners[i](info[0], info[1], info[2], info[3]) && result;
                      }
                      else if (info.length == 5){
                          result = listeners[i](info[0], info[1], info[2], info[3], info[4]) && result;
                      }
                  } 
                  return result;
              }
          }
      }
  };
})();



OrgChart.prototype.importCSV = function () {
  var that = this;
  var fileUpload = document.createElement('INPUT');
  fileUpload.setAttribute('type', 'file');
  fileUpload.setAttribute('accept', '.csv')
  fileUpload.style.display = 'none';
  fileUpload.onchange = function (event) {
      var input = event.target;
      var reader = new FileReader();

      reader.onload = function(){
          var text = reader.result;
          var csv = OrgChart._csvToArray(text, ',');
          var nodes = [];
          var columnNames = csv[0];    
          OrgChart._importSetColumnNames(columnNames, function(newColumnNames){

              for(var i = 1; i < csv.length; i++){                    
                  var node = {};
                  for(var j = 0; j < csv[i].length; j++){
                      var name = newColumnNames[j];
                      var val = csv[i][j];
                      if (name == 'tags' && val != ''){
                          val = val.split(',');
                      }
                      else if (name == 'tags' && val == ''){
                          continue;
                      }
                      node[name] = val;
                  }       
                     
                  if (node.id.trim() != ''){
                      nodes.push(node);                
                  }
              }
  
              var args = {
                  nodes: nodes,
                  columnNames: csv[0]
              };
              
              var result = OrgChart.events.publish('import', [that, args]);
              if (result != false){
                  that.config.nodes = nodes;
                  that.draw();
              }
          });            
      };
      reader.readAsText(input.files[0]);
  };

  fileUpload.click();
}


OrgChart._importSetColumnNames = function (columnNames, callback){
  if (columnNames.indexOf('id') != -1 && columnNames.indexOf('pid') != -1 ){
      callback(columnNames);
      return;
  }

  var importForm = document.createElement("DIV");
  var formText = document.createElement("P");
  formText.style.padding = "5px";
  formText.style.color = 'rgb(122, 122, 122)';
  formText.innerHTML = OrgChart.IMPORT_MESSAGE;
  importForm.appendChild(formText);
  
  // initializing dialog: title, close, content
  var container = document.createElement("div");
  var titleContainer = document.createElement("div");
  var contentContainer = document.createElement("div");
  var closeContainer = document.createElement("span");
  container.setAttribute("id", "sampleDialog");
  container.style.height = "260px";
  container.style.width = "400px";
  container.style.background = "white";
  container.style.border = "0.5px solid grey";
  container.style.position = "fixed";
  container.style.overflow = "hidden";
  container.style.zIndex = "99";
  titleContainer.setAttribute("id", "title");
  titleContainer.style.backgroundColor = "#e5e5e5";
  titleContainer.style.fontWeight = "bold";
  titleContainer.style.color = "rgb(122, 122, 122)";
  titleContainer.style.height = "20px";
  titleContainer.style.padding = "3px 0 0 7px";
  closeContainer.setAttribute("id", "close");
  closeContainer.style.cursor = "pointer";
  closeContainer.style.position = "absolute";
  closeContainer.style.color = "rgb(122, 122, 122)";
  closeContainer.style.fontWeight = "bold";
  closeContainer.style.top = "2px";
  closeContainer.style.zIndex = 100;
  contentContainer.setAttribute("id", "content");
  contentContainer.style.padding = "2px";
  titleContainer.innerHTML = "Import Organizational Chart Data";
  closeContainer.innerHTML = "&times;";
  var headerLine = document.createElement('HR');
  headerLine.style.height = '0.1px';
  headerLine.style.backgroundColor = "#aeaeae";
  headerLine.style.border = "none";
  headerLine.style.margin = "0";
  
  
  container.appendChild(titleContainer);
  container.appendChild(headerLine);
  contentContainer.appendChild(importForm);
  container.appendChild(contentContainer);
  container.appendChild(closeContainer);

  document.body.appendChild(container);
  // place the container in the center of the browser window
  OrgChart._importCenter(container);
  closeContainer.style.left = (container.offsetWidth - 20) + "px";	

  var overlay = document.createElement("div");
  overlay.setAttribute("id", "overlay");
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.position = "fixed";
  overlay.style.background = "grey";
  overlay.style.opacity = "0.5";
  overlay.style.zIndex = 98;
  document.body.appendChild(overlay);
  container._overlay = overlay;
  
  var idLabel = document.createElement("LABEL");
  var txtForId = document.createTextNode("Name:");
  idLabel.setAttribute("for", "id-select");
  idLabel.appendChild(txtForId);
  idLabel.style.fontSize = '16px';
  idLabel.style.color = 'rgb(122, 122, 122)';
  idLabel.style.padding = '5px';
  idLabel.style.margin = '5px';
  idLabel.style.width = "30%";
  idLabel.style.textAlign = "right";
  idLabel.style.display = "inline-block";
  importForm.appendChild(idLabel);

  var selectIdColumn = document.createElement("SELECT");
  selectIdColumn.id = "id-select";
  selectIdColumn.style.fontSize = '16px';
  selectIdColumn.style.color = 'rgb(122, 122, 122)';
  selectIdColumn.style.padding = '5px';
  selectIdColumn.style.margin = '5px';
  selectIdColumn.style.width = '60%';
  selectIdColumn.style.border = "1px solid #aeaeae";
  importForm.appendChild(selectIdColumn);

  var br = document.createElement("BR");
  importForm.appendChild(br);

  for (var i = 0; i<columnNames.length; i++) {
    var z = document.createElement("option");
    z.setAttribute("value", columnNames[i]);
    var t = document.createTextNode(columnNames[i]);
    z.appendChild(t);
    selectIdColumn.appendChild(z);

  }
  var pidLabel = document.createElement("LABEL");
  var txtForPid = document.createTextNode("Reports to:");
  pidLabel.setAttribute("for", "pid-select");
  pidLabel.appendChild(txtForPid); 
  pidLabel.style.fontSize = '16px';
  pidLabel.style.color = 'rgb(122, 122, 122)';
  pidLabel.style.padding = '5px';
  pidLabel.style.margin = '5px';
  pidLabel.style.width = "30%";
  pidLabel.style.textAlign = "right";
  pidLabel.style.display = "inline-block";
  importForm.appendChild(pidLabel);

  var selectPidColumn = document.createElement("SELECT");
  selectPidColumn.id = "pid-select";
  selectPidColumn.style.fontSize = '16px';
  selectPidColumn.style.color = 'rgb(122, 122, 122)';
  selectPidColumn.style.padding = '5px';
  selectPidColumn.style.margin = '5px';
  selectPidColumn.style.width = '60%';
  selectPidColumn.style.border = "1px solid #aeaeae";
  importForm.appendChild(selectPidColumn);


  for (var i = 0; i<columnNames.length; i++) {
    var z = document.createElement("option");
    z.setAttribute("value", columnNames[i]);
    var t = document.createTextNode(columnNames[i]);
    z.appendChild(t);
    selectPidColumn.appendChild(z);

  }

  var btn = document.createElement("BUTTON");
  btn.innerHTML = "Import";
  btn.style.fontSize = '16px';
  btn.style.color = 'rgb(122, 122, 122)';
  btn.style.padding = '5px 20px';
  btn.style.margin = "20px auto";
  btn.style.display = "block";
  btn.onclick = function() {
    container.style.display = "none";
      if (container._overlay){
          container._overlay.parentNode.removeChild(container._overlay);
      }

      var selectedForId = selectIdColumn.options[selectIdColumn.selectedIndex].value;
      var indexforId = columnNames.indexOf(selectedForId);
      columnNames[indexforId] = "id";        

      var selectedForPid = selectPidColumn.options[selectPidColumn.selectedIndex].value;
      var indexforPid = columnNames.indexOf(selectedForPid);
      columnNames[indexforPid] = "pid"; 

      callback(columnNames);
  }
  // binding mouse events
  var btnDiv = document.createElement("DIV");
  btnDiv.appendChild(btn);
  importForm.appendChild(btnDiv);

  closeContainer.onclick = function(evt){
      if (container._overlay){
          container._overlay.parentNode.removeChild(container._overlay);
      }
      
      container.parentNode.removeChild(container);
      // calling the callback function to notify the dialog closed  
      // if(callback){
      // 	callback.call(container);
      // }
      evt.stopPropagation();
  };
  
  // start dragging when the mouse clicked in the title area
  titleContainer.onmousedown = function(evt){
      evt = evt || window.event;
      
      container._dragging = true;
      container._originalLeft = container.offsetLeft;
      container._originalTop = container.offsetTop; 
      container._mouseLeft = evt.clientX;
      container._mouseTop = evt.clientY;
  };
  
  // do the dragging during the mouse move
  document.onmousemove = function(evt){
      evt = evt || window.event;
      
      if(container._dragging){
          container.style.left = 
              (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
          container.style.top = 
              (container._originalTop + evt.clientY - container._mouseTop) + "px";
      }
  };
  
  // finish the dragging when release the mouse button
  document.onmouseup = function(evt){
      evt = evt || window.event;
      
      if(container._dragging){
          container.style.left = 
              (container._originalLeft + evt.clientX - container._mouseLeft) + "px";
          container.style.top = 
              (container._originalTop + evt.clientY - container._mouseTop) + "px";
          
          container._dragging = false;
      }
  };
  
  return container;
};


/**
* place the given dom element in the center of the browser window
* @param {Object} importForm
*/
OrgChart._importCenter = function (importForm) {   
  if(importForm){
      importForm.style.left = (window.innerWidth - importForm.offsetWidth) / 2 + "px";
      importForm.style.top = (window.innerHeight - importForm.offsetHeight) / 2 + "px";
  }
}




OrgChart.prototype.importXML = function () {
  var that = this;
  var fileUpload = document.createElement('INPUT');
  fileUpload.setAttribute('type', 'file');
  fileUpload.setAttribute('accept', '.xml')
  fileUpload.style.display = 'none';
  fileUpload.onchange = function (event) {
      var input = event.target;
      var reader = new FileReader();
      reader.onload = function(){
          var text = reader.result;            
          var nodes = OrgChart._xml2json(text);
          var result = OrgChart.events.publish('import', [that, nodes]);
          if (result != false){
              that.config.nodes = nodes;
              that.draw();
          }
      };
      reader.readAsText(input.files[0]);
  };
  fileUpload.click();
};



OrgChart.prototype.expand = function (id, ids, callback) {
  var actionParams = { id: id, ids: ids };
  this._draw(false, OrgChart.action.expand, actionParams, callback);    
};

OrgChart.prototype.collapse = function (id, ids, callback) {
  var actionParams = { id: id, ids: ids };
  this._draw(false, OrgChart.action.collapse, actionParams, callback);
};

OrgChart.prototype.expandCollapse = function (id, expandIds, collapseIds, callback) {
  if (!Array.isArray(expandIds)){
      expandIds = [];
  }
  if (!Array.isArray(collapseIds)){
      collapseIds = [];
  }
  var actionParams = { id: id, expandIds: expandIds, collapseIds: collapseIds, ids: expandIds.concat(collapseIds) };
  this._draw(false, OrgChart.action.collapse, actionParams, callback);
};

OrgChart.prototype.expandCollapseToLevel = function (id, collapse, expand, callback) {
  this.config.collapse = collapse;
  if (expand == undefined){
      expand = {};
  }
  this.config.expand = expand;
  var actionParams = { id: id,  method: 'expandCollapseToLevel' };
  this._draw(false, OrgChart.action.collapse, actionParams, callback);
};



OrgChart.prototype.maximize = function (id, horizontalCenter, verticalCenter, callback) {
  var that = this;
  var actionParams = { id: id, options: {} };

  actionParams.options.horizontal = false;
  actionParams.options.vertical = false;

  if (horizontalCenter){
      actionParams.options.horizontal = horizontalCenter;
  }
  
  if (verticalCenter){
      actionParams.options.vertical = verticalCenter;
  }

  this._draw(false, OrgChart.action.maximize, actionParams, function(){
      that.ripple(id);
      if (callback){
          callback();
      }
  });
};

OrgChart.prototype.minimize = function (id, callback) {
  var that = this;

  var actionParams = { id: id };
  this._draw(false, OrgChart.action.minimize, actionParams, function(){
      that.ripple(id);
      if (callback){
          callback();
      }
  });
};

OrgChart.prototype._expCollHandler = function (id) {
  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.hide();
  var node = this.getNode(id);


  var collapsedChildrenIds = this.getCollapsedIds(node);
  if (collapsedChildrenIds.length) {//check if the node is collapsed or expanded
      var result = OrgChart.events.publish('expcollclick', [this, false, id, collapsedChildrenIds]);
      if (result === false) {
          return false;
      }

      this.expand(id, collapsedChildrenIds, false);
  }
  else {
      var result = OrgChart.events.publish('expcollclick', [this, true, id, node.childrenIds]);
      if (result === false) {
          return false;
      }

      this.collapse(id, node.childrenIds, false);
  }
};





String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.splice = function (idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

String.prototype.insert = function(index, string) {
  if (index > 0) {
    return this.substring(0, index) + string + this.substr(index);
  }

  return string + this;
};

//indexOf compare object type
Array.prototype.has = function (val) {
  for(var i = 0; i < this.length; i++){
      if (this[i] == val){
          return true;
      }
  }
  return false;    
};

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
          'use strict';
          if (target == null) { // TypeError if undefined or null
              throw new TypeError('Cannot convert undefined or null to object');
          }

          var to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
              var nextSource = arguments[index];

              if (nextSource != null) { // Skip over if undefined or null
                  for (var nextKey in nextSource) {
                      // Avoid bugs when hasOwnProperty is shadowed
                      if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                          to[nextKey] = nextSource[nextKey];
                      }
                  }
              }
          }
          return to;
      },
      writable: true,
      configurable: true
  });
}

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}


OrgChart.prototype._globalMouseDownHandler = function (sender, e) {    
  
  var events = {
      move: "mousemove",
      up: "mouseup",
      leave: "mouseleave"
  };

  if (e.type.indexOf("touch") != -1) {
      if (e.touches.length == 1) {
          this._touch = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY
          };
      }
      else {
          this._touch = null;
      }
      events = {
          move: "touchmove",
          up: "touchend",
          touchstart: "touchstart"
      };
  }

  
  if (sender == e.target) {        
      e.stopPropagation();
      e.preventDefault();

      this._mouseDownHandler(sender, e, events);
      return;
  }
  else if (this.config.nodeMouseClick == OrgChart.action.pan) {        
      var parentEl = e.target;
      
      while (parentEl != sender && !parentEl.hasAttribute("control-expcoll-id")) {     
          parentEl = parentEl.parentNode;
      }        
      if (!parentEl.hasAttribute("control-expcoll-id")){
          e.stopPropagation();
          e.preventDefault();
  
          this._mouseDownHandler(sender, e, events);
          return;
      }
  }
  var parent = e.target;
  while (parent != sender) {

      if (parent.hasAttribute("node-id")) {
          e.stopPropagation();
          if (e.type.indexOf("touch") == -1){ //fix: see mail with subject "Re: I want to purchase your product but I am stuck with the trial" from Santosh Khanal <santosh.khanal55@gmail.com>
              e.preventDefault();
          }
          this._nodeMouseDownHandler(parent, e, events);
          return;
      }
      parent = parent.parentNode;
  }
};

OrgChart.prototype._globalClickHandler = function (sender, e) {
  if (e.type.indexOf("touch") != -1 && this._touch && e.changedTouches.length == 1) {
      if (e.changedTouches.length) {
          var touch = {
              x: e.changedTouches[0].clientX,
              y: e.changedTouches[0].clientY
          };

          var s = OrgChart.t(this.config.template, false, this.getScale()).size;
          var scale = this.getScale();
          var moveX = (Math.abs(touch.x - this._touch.x) / scale);
          var moveY = (Math.abs(touch.y - this._touch.y) / scale);
          this._touch = null;
          if (moveX > s[0] / 10) {
              return;
          }
          if (moveY > s[1] / 10) {
              return;
          }
      }
  }
  else if (e.type.indexOf("touch") != -1 && this._touch == null) {
      return;
  }

  var parent = e.target;  
  while (parent != sender) {

      if (parent.hasAttribute("control-expcoll-id")) {
          var id = parent.getAttribute("control-expcoll-id");
          var node = this.getNode(id);
          this._expCollHandler(node.id);
          return;
      }
  

      if (parent.hasAttribute("node-id")) {
          var id = parent.getAttribute("node-id");
          var node = this.getNode(id); //we need it becouse to get int id instead of string
          this._nodeClickHandler(node.id, e);
          return;
      } 

      if (parent.hasAttribute("control-node-menu-id")) {
          var id = parent.getAttribute("control-node-menu-id");
          var node = this.getNode(id);
          this._nodeMenuClickHandler(node.id, parent, e);
          return;
      }   

      if (parent.hasAttribute("control-add")) {
          this._lonelyButtonHandler();
          return;
      }    

      parent = parent.parentNode;
  }
};


OrgChart.prototype._globalContextHandler = function (sender, e) {
  var parent = e.target;  
  while (parent != sender) {
      if (parent.hasAttribute("node-id")) {
          var id = parent.getAttribute("node-id");
          var node = this.getNode(id); //we need it becouse to get int id instead of string
          this._nodeContextHandler(node.id, e);
          return;
      } 

      parent = parent.parentNode;
  }
};

OrgChart.prototype._nodeContextHandler = function (id, e) {
  e.preventDefault();
  this.searchUI.hide();
  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.hide();

  var node = this.get(id);


  
  var menu = null;
  if (node != null && Array.isArray(node.tags)) {
      for (var i = 0; i < node.tags.length; i++) {
          var tag = node.tags[i];
          if (this.config.tags[tag] && this.config.tags[tag].nodeContextMenu) {
              menu = this.config.tags[tag].nodeContextMenu;
          }
      }
  }
  
  this.nodeContextMenuUI.show(e.pageX, e.pageY, id, null, menu);
};

OrgChart.prototype._globalDbClickHandler = function (sender, e) {
  var parent = e.target;
  while (parent != sender) {
      if (parent.hasAttribute("node-id")) {
          var id = parent.getAttribute("node-id");
          var node = this.getNode(id);//we need it becouse to get int id instead of string            
          this._nodeDbClickHandler(node.id, e);
          return;
      } 

      parent = parent.parentNode;
  }
};

OrgChart.prototype._mouseScrollHandler = function (sender, e) {
  if (this.config.mouseScrool == OrgChart.action.ctrlZoom && !e.ctrlKey){
      return;
  }
  
  var that = this;
  var moving = false;

  var speed = this.config.zoom.speed;
  var smooth = this.config.zoom.smooth;
  var pos = 0;
  var scale = this.getScale();;
  var scrollPointInPercent = OrgChart._centerPointInPercent(that.getSvg(), e.pageX, e.pageY);

  function update() {
      moving = true;
      var delta = (pos - scale) / smooth;
      if (delta > 0) {
          delta++;
      }
      else {
          delta--;
      }
      scale += delta;

      that.zoom(1 - (delta / 12) / 50, scrollPointInPercent);   

      if (parseInt(scale) == parseInt(pos)) {
          moving = false;
      }
      else {
          requestFrame(update);
      }
  }

  var requestFrame = function () { // requestAnimationFrame cross browser
      return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (func) {
              setTimeout(func, 1000 / 50);
          }
      );
  }();

  e.preventDefault(); // disable default scrolling
  var delta = e.delta || e.wheelDelta;

  if (delta === undefined) {
      //we are on firefox
      delta = -e.detail;
  }
  delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
  pos += -delta * speed;    

  if (!moving) update();
};

OrgChart.prototype._nodeMouseDownHandler = function (sender, mde, normalizedEvents) {    
  if (!this.config.enableDragDrop) {
      return;
  }  
  var client = OrgChart._getClientXY(mde);

  var id = sender.getAttribute("node-id");
  var draggedNode = this.getNode(id);

  sender._dragEventFired = false;
  var lastHoveredNodeId = null;
  var lastHoveredNode = null;

  this._gragStartedId = id;    

  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

  var that = this;
  var svg = this.getSvg();

  var dragStart = {
      x: client.x,
      y: client.y
  };

  var matrix = OrgChart._getTransform(sender);
  var x = matrix[4];
  var y = matrix[5];

  var scale = that.getScale();
  var dragNodeElement = sender.cloneNode(true);

  
  svg.insertBefore(dragNodeElement, svg.firstChild);
  dragNodeElement.style.opacity = 0.7;    


  var removeOpacity = function(lhnid, lhn){
      if (lhnid != null) {
          lhn.style.opacity = 1;
          var node = that.getNode(lastHoveredNodeId);
          var stParentNodes = OrgChart.getStParentNodes(node);
          
          for(var i = 0; i < stParentNodes.length; i++){
              var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
              if (stParentNodeElement){
                  stParentNodeElement.style.opacity = 1;       
              }
          }    
      }
  }

  var moveHandler = function (e) {
      if (dragStart) {      

          var c = OrgChart._getClientXY(e);
          var p = document.elementFromPoint(c.x, c.y);

          var client = OrgChart._getOffsetXY(that.element, e);
          var movePosition = {
              left: (that.width() - (client.x + that.config.padding)) < 0,
              right: (client.x - that.config.padding) < 0,
              down: (that.height() - (client.y + that.config.padding)) < 0,
              up: (client.y - that.config.padding) < 0,
          };
          if (movePosition.left || movePosition.right || movePosition.up || movePosition.down){        
              if (svg.classList){
                  svg.classList.remove("cursor-grab");
                  svg.classList.add("cursor-move");
                  svg.classList.remove("cursor-nodrop");
                  svg.classList.remove("cursor-copy");
              }

              var mx = matrix[4];
              var my = matrix[5];
              var dx = dragStart.x;
              var dy = dragStart.y;
              var cx = c.x;
              var cy = c.y;              
              that.startMove(movePosition, function(go){                    
                  matrix[4] = mx + go.x;
                  matrix[5] = my + go.y;
                  dragStart.x = dx  - go.xWithoutScale;
                  dragStart.y = dy  - go.yWithoutScale;
                  c.x = cx  - go.xWithoutScale;
                  c.y = cy  - go.yWithoutScale;                    
                  dragNodeElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
              });        
          }
          else{
              that.stopMove();
              if (svg.classList){
                  svg.classList.add("cursor-grab");
                  svg.classList.remove("cursor-move");
                  svg.classList.remove("cursor-nodrop");
                  svg.classList.remove("cursor-copy");
              }


              removeOpacity(lastHoveredNodeId, lastHoveredNode);
              lastHoveredNodeId = null;
              lastHoveredNode = null;           


              if (that.config.enableDragDrop) {
                  while (p != null && p != svg) {
                      if (p.hasAttribute && p.hasAttribute("node-id")) {
                          var id = p.getAttribute("node-id");
                          if (that._gragStartedId && id != that._gragStartedId) {
                              lastHoveredNodeId = id;
                              lastHoveredNode = p;
                              break;
                          }
                      }
                      p = p.parentNode;
                  }
              }

              if (lastHoveredNodeId != null) {
                  lastHoveredNode.style.opacity = 0.5;                    
                  var node = that.getNode(lastHoveredNodeId);
                  var stParentNodes = OrgChart.getStParentNodes(node);
                  
                  for(var i = 0; i < stParentNodes.length; i++){
                      var stParentNodeElement = that.getNodeElement(stParentNodes[i].id);
                      if (stParentNodeElement){
                          stParentNodeElement.style.opacity = 0.1;       
                      }
                  }                    
                  if (!that._canUpdateLink(draggedNode.id, lastHoveredNodeId) && svg.classList){
                      svg.classList.remove("cursor-grab");
                      svg.classList.remove("cursor-move");
                      svg.classList.remove("cursor-copy");
                      svg.classList.add("cursor-nodrop");
                  }
                  else if (svg.classList){
                      svg.classList.remove("cursor-grab");
                      svg.classList.remove("cursor-move");
                      svg.classList.add("cursor-copy");
                      svg.classList.remove("cursor-nodrop"); 
                  }
              }

              var moveX = (c.x - dragStart.x) / scale;
              var moveY = (c.y - dragStart.y) / scale;
            
              matrix[4] = x + moveX;
              matrix[5] = y + moveY;  
              
              if (!sender._dragEventFired && (Math.abs(c.x - dragStart.x) > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE || Math.abs(c.y - dragStart.y)  > OrgChart.FIRE_DRAG_NOT_CLICK_IF_MOVE)){
                  var resultDrag = OrgChart.events.publish('drag', [that, id]);
                  if (resultDrag === false) {   
                      leaveHandler();     
                  }                    
                  sender._dragEventFired = true;
              }
              
              dragNodeElement.setAttribute("transform", "matrix(" + matrix.toString() + ")");
          }            
      }
  };
  
  var leaveHandler = function (e) {
      that.stopMove();     
      if (svg.classList){
          svg.classList.remove("cursor-grab");
          svg.classList.remove("cursor-move");
          svg.classList.remove("cursor-nodrop");
          svg.classList.remove("cursor-copy");    
      }

      svg.removeEventListener(normalizedEvents.move, moveHandler);
      svg.removeEventListener(normalizedEvents.up, leaveHandler);

      if (normalizedEvents.leave) {
          svg.removeEventListener(normalizedEvents.leave, leaveHandler);
      }

      if ((draggedNode.id == lastHoveredNodeId) || (lastHoveredNodeId == null)) {            
          svg.removeChild(dragNodeElement);
          that._gragStartedId = null;

          return;
      }

      var droppedNode = that.getNode(lastHoveredNodeId);

      
      var result = OrgChart.events.publish('drop', [that, draggedNode.id, droppedNode.id]);
      if (result === false) {
          removeOpacity(lastHoveredNodeId, lastHoveredNode);
          svg.removeChild(dragNodeElement);
          that._gragStartedId = null;
          
          return;
      }

      if (that._canUpdateLink(draggedNode.id, lastHoveredNodeId)) {    
          var data = that.get(draggedNode.id);
          data.pid = lastHoveredNodeId;
          data.stpid = null;
          that.updateNode(data, null, true);         
      }
      else {
          svg.removeChild(dragNodeElement);
          removeOpacity(lastHoveredNodeId, lastHoveredNode);
      }

      that._gragStartedId = null;
  };

  svg.addEventListener(normalizedEvents.move, moveHandler);
  svg.addEventListener(normalizedEvents.up, leaveHandler);
  if (normalizedEvents.leave) {
      svg.addEventListener(normalizedEvents.leave, leaveHandler);     
  }
};


OrgChart.prototype._resizeHandler = function (sender, e) {
  var viewBox = this.getViewBox();
  var svg = this.getSvg();
  var w = svg.getAttribute('width');
  var h = svg.getAttribute('height');

  var scaleX = w / viewBox[2];
  var scaleY = h / viewBox[3];
  var scale = scaleX > scaleY ? scaleY : scaleX; //do not use this.getScale as it is using the wrong (old) width/height

  svg.setAttribute('width', this.width());
  svg.setAttribute('height', this.height());

  //viewBox[0] = viewBox[0] / scale;
  //viewBox[1] = viewBox[1] / scale;

  viewBox[2] = this.width() / scale;
  viewBox[3] = this.height() / scale;
  
  this.setViewBox(viewBox);

  this.xScrollUI.create(this.width());
  this.yScrollUI.create(this.height());

  this._draw(false, OrgChart.action.resize);
};

OrgChart.prototype._nodeDbClickHandler = function (id, e) {
  var result = OrgChart.events.publish('dbclick', [this, this.get(id)]);
  if (result === false) {
      return false;
  }

  this._commonClickHandler(id, e, this.config.nodeMouseDbClick);
};

OrgChart.prototype._nodeClickHandler = function (id, e) {
  var nodeElement = this.getNodeElement(id);
  if (nodeElement._dragEventFired){
      nodeElement._dragEventFired = false;
      return;
  }
  var result = OrgChart.events.publish('click', [this, { node: this.getNode(id), event: e }]);
  if (result === false) {
      return false;
  }


  this._commonClickHandler(id, e, this.config.nodeMouseClick);
};

OrgChart.prototype._commonClickHandler = function (id, e, action) {
  this.searchUI.hide();
  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.hide();

  var node = this.getNode(id);


  if (action == OrgChart.action.expandCollapse) {
      var collapsedChildrenIds = this.getCollapsedIds(node);
      if (collapsedChildrenIds.length) {//check if the node is collapsed or expanded
          var result = OrgChart.events.publish('expcollclick', [this, false, id, collapsedChildrenIds]);

          if (result === false) {
              return false;
          }

          this.expand(id, collapsedChildrenIds, false);
      }
      else {
          var result = OrgChart.events.publish('expcollclick', [this, true, id, node.childrenIds]);
          if (result === false) {
              return false;
          }
          this.collapse(id, node.childrenIds, false);
      }
      this.ripple(node.id, e.clientX, e.clientY);
  }

  if (action == OrgChart.action.edit) {
      this.editUI.show(node.id);
      this.ripple(node.id, e.clientX, e.clientY);
  }
  if (action == OrgChart.action.details) {
      this.editUI.show(node.id, true);
      this.ripple(node.id, e.clientX, e.clientY);
  }
};


OrgChart.prototype._menuHandlerMouseDownHandler = function (sender, e) {
  e.stopPropagation();
  e.preventDefault();    
};


OrgChart.prototype._nodeMenuClickHandler = function (id, el, e) {
  this.searchUI.hide();
  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.hide();
  

  var node = this.getNode(id);

  var menu = null;
  if (Array.isArray(node.tags)) {
      for (var i = 0; i < node.tags.length; i++) {
          var tag = node.tags[i];
          if (this.config.tags[tag] && this.config.tags[tag].nodeMenu) {
              menu = this.config.tags[tag].nodeMenu;
          }
      }
  }
  
  this.nodeMenuUI.showStickIn(el, id, null, menu);
};



OrgChart.prototype._exportMenuClickHandler = function (sender, e) {
  e.stopPropagation();
  e.preventDefault();

  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.show(sender.offsetLeft, sender.offsetTop);    
};

OrgChart.prototype._lonelyButtonHandler = function () {
  var result = this.addNode({ id: this.generateId() }, null, true);
  if (result !== false){
      this.center(node.id);
  }
};
























OrgChart.prototype._move = function (top, left, viewBox) {
  viewBox[0] = left;
  viewBox[1] = top;
  this.setViewBox(viewBox);
  
  this.xScrollUI.setPosition();
  this.yScrollUI.setPosition();
};


OrgChart.prototype.startMove = function (movePosition, tick) {
  if (!movePosition){
      console.error("movePosition parameter not defined");
      return;
  }
  this._movePosition = movePosition;
  if (this._moveInterval){
      return;
  }

  var that = this;
  var vb = this.getViewBox().slice(0); //clone;
  var scale = this.getScale(); 
  var countX = 0;
  var countY = 0;

  this._moveInterval = setInterval(function(){
      var go = {
          x: 0,
          y: 0,
          xWithoutScale: 0,
          yWithoutScale: 0
      };
      if (that._movePosition.left){
          countX ++;
          go.x = ( countX * OrgChart.MOVE_STEP) / scale;
          go.xWithoutScale = (countX * OrgChart.MOVE_STEP);
      }        
      if (that._movePosition.right){
          countX ++;
          go.x = -( countX * OrgChart.MOVE_STEP) / scale;
          go.xWithoutScale = -(countX * OrgChart.MOVE_STEP);
      }
      if (that._movePosition.up){
          countY ++;
          go.y = -( countY * OrgChart.MOVE_STEP) / scale;
          go.yWithoutScale = -( countY * OrgChart.MOVE_STEP);
      }        
      if (that._movePosition.down){
          countY ++;
          go.y = ( countY * OrgChart.MOVE_STEP) / scale;
          go.yWithoutScale = ( countY * OrgChart.MOVE_STEP);
      }
      that.setViewBox([vb[0] + go.x, vb[1] + go.y, vb[2], vb[3]]);
          
      that.xScrollUI.setPosition();
      that.yScrollUI.setPosition();

      if (tick){
          tick(go);
      }

  }, OrgChart.MOVE_INTERVAL);      
};


OrgChart.prototype.stopMove = function () {
  if (this._moveInterval) {
      clearInterval(this._moveInterval);
      this._moveInterval = null;
      this._movePosition = null;
  }
};


if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}
OrgChart.node = function (id, pid, tags, templateName) {
  this.templateName = templateName;    
  this.id = id;
  this.pid = pid;
  this.children = [];
  this.childrenIds = [];      
  this.parent = null;    
  this.stpid = null;
  this.stParent = null;
  this.stChildren = [];  
  this.stChildrenIds = [];  
  this.tags = tags;      

  if (!this.tags){
      this.tags = [];
  }

  //this.leftNeighbor = null;
  //this.rightNeighbor = null;
  //this._prelim = 0;
  //this._modifier = 0;
  //this.x = null;
  //this.y = null;    
  //this.lcn = undefined; //layout config name    
  //this.isAssistant = undefined;    
  //this.subLevels = undefined;
  //this.stContainerNodes = undefined; a propety only  for the root []
  //this.w;
  //this.h;        
  //this.order
  //this.padding = [10,10,10,10] set only if min = false    
  //this.isSplit 
  //this._m //mirror 
  //this.collapsed = false;
  //this.level = undefined;   
  //this.min = false;    
  //this.hasPartners = undefined;
  //this.hasAssistants = undefined;    
  //this.sl = undefined //structire level;
  //this.isPartner = undefined; 1
  //this.ppid
  //this.parnerSeparation = undefinded;
};

var node = new OrgChart.node();



OrgChart.prototype._mouseDownHandler = function (sender, e, normilizedEvents) {

  var that = this;
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

  this.editUI.hide();
  this.searchUI.hide();
  this.nodeMenuUI.hide();
  this.nodeContextMenuUI.hide();
  this.menuUI.hide();

  var viewBox = this.getViewBox();    
  var scale = this.getScale();



  var client0 = OrgChart._getClientTouchesXY(e, 0);    
  var client1 = OrgChart._getClientTouchesXY(e, 1);    

  var start = {
      diffX: 0,
      diffY: 0,
      x0: client0.x,
      y0: client0.y,
      type: "pan",
      viewBoxLeft: viewBox[0],
      viewBoxTop: viewBox[1]
  };

  if (e.touches && e.touches.length > 1) {
      start.type = "pinch";
      start.dist = Math.sqrt((client0.x - client1.x) * (client0.x - client1.x) +
          (client0.y - client1.y) * (client0.y - client1.y));
  }

  var pointer = this.getPointerElement();

  if (start.type == "pan") {
      this._hideBeforeAnimation();

      var offset = OrgChart._getOffsetXY(this.element, e);
      var x = offset.x / scale + viewBox[0] - 16 / scale;
      var y = offset.y / scale + viewBox[1] - 16 / scale;

      pointer.style.display = "inherit";
      pointer.setAttribute("transform", "matrix(0,0,0,0," + x + "," + y + ")");

      OrgChart.anim(pointer,
          { transform: [0, 0, 0, 0, x, y], opacity: 0 },
          { transform: [1 / scale, 0, 0, 1 / scale, x, y], opacity: 1 },
          300,
          OrgChart.anim.outBack);
  }


  var moveHandler = function (e) {
      var c0 = OrgChart._getClientTouchesXY(e, 0);

      if (start && start.type == "pan") { //pan
          that._hideBeforeAnimation();
          start.diffX = c0.x - start.x0;
          start.diffY = c0.y - start.y0;

          var top = -(start.diffY / scale) + start.viewBoxTop;
          var left = -(start.diffX / scale) + start.viewBoxLeft;

          that._move(top, left, viewBox);
      }
      else if (start && start.type == "pinch"){ //pinch
          var c1 = OrgChart._getClientTouchesXY(e, 1);


          var dist = Math.sqrt((c0.x - c1.x) * (c0.x - c1.x) +
              (c0.y - c1.y) * (c0.y - c1.y));

          
          var touchScale = 1 + ((dist - start.dist) / (start.dist / 100)) / 100;
          start.dist = dist;
          var pinchMiddlePointInPercent = OrgChart._pinchMiddlePointInPercent(that.element, that.width(), that.height(), e);            
          that.zoom(touchScale, pinchMiddlePointInPercent);
      }
  };

  var leaveHandler = function () {
      if (start.type == "pan" && that.config.sticky) {
          OrgChart._moveToBoundaryArea(
              sender,
              that.getViewBox(),
              that.response.boundary, function () {
                  that._draw(true, OrgChart.action.pan);
              });
      }
      else if (start.type == "pan" && !that.config.sticky){
          that._draw(true, OrgChart.action.pan);
      }

      start = null;

      pointer.style.display = "none";

      sender.removeEventListener(normilizedEvents.move, moveHandler);
      sender.removeEventListener(normilizedEvents.up, leaveHandler);
      if (normilizedEvents.leave) {
          sender.removeEventListener(normilizedEvents.leave, leaveHandler);
      }
      if (normilizedEvents.touchstart) {
          sender.removeEventListener(normilizedEvents.touchstart, leaveHandler);
      }
  };


  sender.addEventListener(normilizedEvents.move, moveHandler);
  sender.addEventListener(normilizedEvents.up, leaveHandler);
  if (normilizedEvents.leave) {
      sender.addEventListener(normilizedEvents.leave, leaveHandler);
  }
  if (normilizedEvents.touchstart) {
      sender.addEventListener(normilizedEvents.touchstart, leaveHandler);
  }
};


if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.local = {};


OrgChart.local._setPositions = function (roots, layoutConfigs, callback) {
  var borders = {};

  for(var i = 0; i < roots.length; i++){
      var root = roots[i];
      if (root.stContainerNodes){            
          for(var j = root.stContainerNodes.length - 1; j >= 0; j--){
              var stContainerNode = root.stContainerNodes[j];
              var border = OrgChart.local._walk(stContainerNode.stChildren, layoutConfigs);
              stContainerNode.w = border.maxX - border.minX + stContainerNode.padding[3] + stContainerNode.padding[1];
              stContainerNode.h = border.maxY - border.minY + stContainerNode.padding[0] + stContainerNode.padding[2];
              if (stContainerNode._m){
                  stContainerNode._m.w = stContainerNode.w;
                  stContainerNode._m.h = stContainerNode.h;
              }

              borders[stContainerNode.id] = border;
          }
      }
  }

  OrgChart.local._walk(roots, layoutConfigs);

  for(var i = 0; i < roots.length; i++){
      var root = roots[i];
      if (root.stContainerNodes){                        
          for(var j = 0; j < root.stContainerNodes.length; j++){
              var stContainerNode = root.stContainerNodes[j];
              var adjustX = stContainerNode.x;
              var adjustY = stContainerNode.y;
              for(var k = 0; k < stContainerNode.stChildren.length; k++){                    
                  var stChildren = stContainerNode.stChildren[k];
                  OrgChart.local._lastWalk(stChildren, adjustX, adjustY, borders[stContainerNode.id], stContainerNode.padding)
              }                
          }
      }
  }

  callback();
};


OrgChart.local._walk = function (roots, layoutConfigs) {

  var border = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
  };

  var maxLevelHeightArr = [];
  var maxTreeRowHeightArr = [];
  var previousLevelNodeArr = [];    

  
  for (var i = 0; i < roots.length; i++) {
      
      var configName = roots[i].lcn ? roots[i].lcn : "base";
      var config = layoutConfigs[configName];

       var row = parseInt(i / config.columns);
       var column = i - row * config.columns;
      if (column == 0) {
          previousLevelNodeArr = [];
      };
      OrgChart.local._firstWalk(roots[i],  0, maxLevelHeightArr, previousLevelNodeArr, config);  
  }   
  
  for (var i = 0; i < roots.length; i++) {
      var configName = roots[i].lcn ? roots[i].lcn : "base";
      var config = layoutConfigs[configName];
      var row = parseInt(i / config.columns);
      var column = i - row * config.columns;
      var y = 0;
      if (row > 0) {
          y = maxTreeRowHeightArr[row - 1] + config.siblingSeparation;
      };
      OrgChart.local._secondWalk(roots[i], 0, 0, y, maxLevelHeightArr, border, config);
      maxTreeRowHeightArr[row] = border.maxY - border.minY;

      switch (config.orientation) {
          case OrgChart.orientation.right:
          case OrgChart.orientation.right_top:
          case OrgChart.orientation.left:
          case OrgChart.orientation.left_top:
              maxTreeRowHeightArr[row] = border.maxX - border.minX;
              break;
      }    
  }
  

  return border;
};


//Layout algorithm
OrgChart.local._firstWalk = function (node, level, maxLevelHeightArr, previousLevelNodeArr, config) {    
  if (node.isPartner){
      return;
  }
  var leftSibling = null;
  node.x = 0;
  node.y = 0;
  node._prelim = 0;
  node._modifier = 0;
  node.leftNeighbor = null;
  node.rightNeighbor = null;
  OrgChart.local._setLevelMaxNodeHeight(node, level, maxLevelHeightArr, config);
  OrgChart.local._setNeighbors(node, level, previousLevelNodeArr);        
  

  if (!OrgChart.local._hasChildren(node) || level == OrgChart.MAX_DEPTH) {
      leftSibling = OrgChart.local._getLeftSibling(node);
      if (leftSibling != null) {
          var siblingSeparation = config.siblingSeparation;
          
          if (node.isAssistant){
              siblingSeparation = config.assistantSeparation;
          }
          else if (leftSibling.layout == 2) {
              siblingSeparation = config.mixedHierarchyNodesSeparation;
          }
          else if (leftSibling.parent && leftSibling.parent.hasPartners == 4 && config.orientation <= 3) {
              var parentSize = OrgChart.local._size(leftSibling.parent, config);                
              var leftMid = OrgChart.local._rightMidPoint(leftSibling, config);

               siblingSeparation = leftSibling.parent.partnerSeparation  + parentSize / 2 - leftMid;
               if (siblingSeparation < config.siblingSeparation){
                  siblingSeparation = config.siblingSeparation;
               }
          }
          
          node._prelim = leftSibling._prelim + OrgChart.local._nodeWithPartnersSize(leftSibling, config) + siblingSeparation;
      }
      else {
          node._prelim = 0;           
      }       
  }
  else {
      var n = node.children.length;
      for (var i = 0; i < n; i++) {
          OrgChart.local._firstWalk(node.children[i], level + 1, maxLevelHeightArr, previousLevelNodeArr, config);
      }

      var fChildNode = OrgChart.local._fChild(node);
      var lChildNode = node.children[node.children.length - 1];

      var midPoint = fChildNode._prelim + (lChildNode._prelim - fChildNode._prelim) / 2 + OrgChart.local._leftMidPoint(lChildNode, config); 

      //#307 fix start
      if (fChildNode.isAssistant && lChildNode.isAssistant){
          midPoint = fChildNode._prelim + (lChildNode._prelim - fChildNode._prelim) / 2 + OrgChart.local._leftMidPoint(fChildNode, config);            
      }

      midPoint -= OrgChart.local._mid(node, config);


      leftSibling = OrgChart.local._getLeftSibling(node);

      if (leftSibling != null) {

          var siblingSeparation = config.siblingSeparation;
          
          if (node.isAssistant && node.isSplit){
              siblingSeparation = config.assistantSeparation;
          }
          else if (leftSibling.layout == 2) {
              siblingSeparation = config.mixedHierarchyNodesSeparation;
          }
          else if (leftSibling.parent && leftSibling.parent.hasPartners == 4 && config.orientation <= 3) {
              var parentSize = OrgChart.local._size(leftSibling.parent, config);                
              var leftMid = OrgChart.local._rightMidPoint(leftSibling, config);

               siblingSeparation = leftSibling.parent.partnerSeparation * 15 + parentSize / 2 - leftMid;
               if (siblingSeparation < config.siblingSeparation){
                  siblingSeparation = config.siblingSeparation;
               }
          }

          node._prelim = leftSibling._prelim + OrgChart.local._nodeWithPartnersSize(leftSibling, config) + siblingSeparation;       
          node._modifier = node._prelim - midPoint;            
               
          OrgChart.local._apportion(node, level, config);   
      }
      else if (config.orientation <= 3) {                
          node._prelim = midPoint;
      }
      else {            
          node._prelim = 0;
      }
  }
};

OrgChart.local._secondWalk = function (node, level, X, Y, maxLevelHeightArr, border, config) {
  if (level <= OrgChart.MAX_DEPTH && !node.isPartner ) {
      var xTmp = node._prelim + X;
      var yTmp = Y;
      var maxsizeTmp = 0;
      var nodesizeTmp = 0;
      
      maxsizeTmp = maxLevelHeightArr[level];
      nodesizeTmp = OrgChart.local._getNodeHeight(node, config);

      node.x = xTmp;
      node.y = yTmp;

      if (node.hasPartners){
          OrgChart.local.nodeHasPartnersPosition(node, config, maxsizeTmp);
      }

    
      if (node.isSplit || (node.isAssistant || node.layout == 2)) {
          node.y = yTmp + maxsizeTmp / 2 - nodesizeTmp / 2;
      }


      switch (config.orientation) {
          case OrgChart.orientation.right:
          case OrgChart.orientation.right_top:
          case OrgChart.orientation.left:
          case OrgChart.orientation.left_top:
              var swapTmp = node.x;
              node.x = node.y;
              node.y = swapTmp;
              break;
      }

      switch (config.orientation) {
          case OrgChart.orientation.bottom:
          case OrgChart.orientation.bottom_left:
              node.y = -node.y - nodesizeTmp;
              break;

          case OrgChart.orientation.right:
          case OrgChart.orientation.right_top:
              node.x = -node.x - nodesizeTmp;
              break;
      }  

      OrgChart._setMinMaxXY(node, border);

      if (node.children != 0) { //do not use OrgChart.local._hasChildren here will not render partners
          var levelSeparation = config.levelSeparation;
          if (node.layout == OrgChart.mixed || node.layout == OrgChart.tree) {
              levelSeparation = config.mixedHierarchyNodesSeparation;
          }
          var index = 0;
          OrgChart.local._secondWalk(node.children[index], level + 1, X + node._modifier, Y + maxsizeTmp + levelSeparation, maxLevelHeightArr, border, config);
          if (node.children[index].isPartner){
              while(node.children.length - 1 > index && node.children[index].isPartner){
                  index++;
              }
              OrgChart.local._secondWalk(node.children[index], level + 1, X + node._modifier, Y + maxsizeTmp + levelSeparation, maxLevelHeightArr, border, config);
          }
      }
      var rightSibling = OrgChart.local._getRightSibling(node);

      if (rightSibling != null) {
          OrgChart.local._secondWalk(rightSibling, level, X, Y, maxLevelHeightArr, border, config);
      }
  }
  else{
     OrgChart.local.nodeIsPartnerPosition(node, config, maxLevelHeightArr, level);     
  }
};

OrgChart.local._lastWalk = function (node, adjustX, adjustY, border, padding) {
  node.x += adjustX + padding[3] - border.minX;
  node.y += adjustY + padding[0] - border.minY;
  var n = node.children.length;
  for (var i = 0; i < n; i++) {
      var iChild = node.children[i];
      OrgChart.local._lastWalk(iChild, adjustX, adjustY, border, padding);
  }
};


OrgChart.local._apportion = function (node, level, config) {
  if (node.isPartner){
      return;
  }
  var firstChild = OrgChart.local._fChild(node);
  var firstChildLeftNeighbor = firstChild.leftNeighbor;
  var j = 1;
  for (var k = OrgChart.MAX_DEPTH - level; firstChild != null && firstChildLeftNeighbor != null && j <= k;) {
      var modifierSumRight = 0;
      var modifierSumLeft = 0;
      var rightAncestor = firstChild;
      var leftAncestor = firstChildLeftNeighbor;
      for (var l = 0; l < j; l++) {
          rightAncestor = rightAncestor.parent;
          leftAncestor = leftAncestor.parent;
          modifierSumRight += rightAncestor._modifier;
          modifierSumLeft += leftAncestor._modifier;
      }

      var subtreeSeparation = config.subtreeSeparation;

      if (node.leftNeighbor && node.leftNeighbor.layout == 2) {
          subtreeSeparation = 0;
      }

      var totalGap = (firstChildLeftNeighbor._prelim + modifierSumLeft + OrgChart.local._nodeWithPartnersSize(firstChildLeftNeighbor, config) + subtreeSeparation) - (firstChild._prelim + modifierSumRight);
      if (totalGap > 0) {
          var subtreeAux = node;
          var numSubtrees = 0;
          for (; subtreeAux != null && subtreeAux != leftAncestor; subtreeAux = OrgChart.local._getLeftSibling(subtreeAux))
              numSubtrees++;


          if (subtreeAux != null) {
              var subtreeMoveAux = node;
              var singleGap = totalGap / numSubtrees;
              for (; subtreeMoveAux != leftAncestor; subtreeMoveAux = OrgChart.local._getLeftSibling(subtreeMoveAux)) {
                  subtreeMoveAux._prelim += totalGap;
                  subtreeMoveAux._modifier += totalGap;
                  totalGap -= singleGap;
              }
          }
      }
      j++;
      if (!OrgChart.local._hasChildren(firstChild))
          firstChild = OrgChart.local._getLeftmost(node, 0, j);
      else
          firstChild = OrgChart.local._fChild(firstChild);
      if (firstChild != null)
          firstChildLeftNeighbor = firstChild.leftNeighbor;
  }
}


OrgChart.local._setLevelMaxNodeHeight = function (node, level, maxLevelHeightArr, config) {
  if (maxLevelHeightArr[level] == null)
      maxLevelHeightArr[level] = 0;
  

  var h = OrgChart.local._getNodeHeight(node, config);
  

  if (maxLevelHeightArr[level] < h)
      maxLevelHeightArr[level] = h;
};


OrgChart.local._setNeighbors = function (node, level, previousLevelNodeArr) {
  if (previousLevelNodeArr[level] && previousLevelNodeArr[level].id === node.id) {
      return;
  }

  node.leftNeighbor = previousLevelNodeArr[level];

  if (node.leftNeighbor != null)
      node.leftNeighbor.rightNeighbor = node;

  if (!node.isPartner)
      previousLevelNodeArr[level] = node;
};


OrgChart.local._nodeWithPartnersSize = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          return OrgChart.local._getPartnerRightPanelWidth(node, config) + node.w + OrgChart.local._getPartnerLeftPanelWidth(node, config);

      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return OrgChart.local._getPartnerRightPanelHeight(node, config) + node.h + OrgChart.local._getPartnerLeftPanelHeight(node, config);
  }
  
  return 0;
};

OrgChart.local._size = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:            
          return node.w;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return node.h;
  }
  
  return 0;
};

OrgChart.local._leftMidPoint = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:            
          return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return OrgChart.local._getPartnerLeftPanelHeight(node, config) + node.h / 2;
  }
  
  return 0;
};

OrgChart.local._rightMidPoint = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:            
          return OrgChart.local._getPartnerRightPanelWidth(node, config)  + node.w / 2;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return OrgChart.local._getPartnerRightPanelHeight(node, config) + node.h / 2;
  }
  
  return 0;
};

OrgChart.local._mid = function (node, config) { 
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left: 
          switch (node.hasPartners){
              case 2:
                  return OrgChart.local._getPartnerLeftPanelWidth(node, config) - node.partnerSeparation / 2;                    
              case 3:
                  return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w  + node.partnerSeparation / 2;   
              case 4: {
                  if (config.orientation <= 3){
                      var leftMid = OrgChart.local._rightMidPoint(OrgChart.local._fChild(node), config);
                      var rightMid = OrgChart.local._leftMidPoint(node.children[node.children.length - 1], config);
                      return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2 + (rightMid - leftMid) / 2;                   
                  }
                  else{
                      return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;                    
                  }
              }
              default: 
                  return OrgChart.local._getPartnerLeftPanelWidth(node, config)  + node.w / 2;                    
          }        

      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          switch (node.hasPartners){
              case 2:
                  return OrgChart.local._getPartnerLeftPanelHeight(node, config) - node.partnerSeparation / 2;                    
              case 3:
                  return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h  + node.partnerSeparation / 2;   
              case 4: {
                  if (config.orientation <= 3){
                      var leftMid = OrgChart.local._rightMidPoint(OrgChart.local._fChild(node), config);
                      var rightMid = OrgChart.local._leftMidPoint(node.children[node.children.length - 1], config);
                      return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2 + (rightMid - leftMid) / 2;  
                  }        
                  else{
                      return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2;                                 
                  }         
              }      
              default: 
                  return OrgChart.local._getPartnerLeftPanelHeight(node, config)  + node.h / 2;                    
          }        
  }
  
  return 0;
};

OrgChart.local._getNodeHeight = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          return Math.max(OrgChart.local._getPartnerRightPanelHeight(node, config),  node.h, OrgChart.local._getPartnerLeftPanelHeight(node, config));

      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return Math.max(OrgChart.local._getPartnerRightPanelWidth(node, config),  node.w, OrgChart.local._getPartnerLeftPanelWidth(node, config));
  }
  
  return 0;
};



OrgChart.local._getLeftSibling = function (node) {
  if ((node.leftNeighbor != null && node.leftNeighbor.parent == node.parent)) {
      return node.leftNeighbor;
  }
  else
      return null;
};

OrgChart.local._getRightSibling = function (node) {
  if (node.rightNeighbor != null && node.rightNeighbor.parent == node.parent)
      return node.rightNeighbor;
  else
      return null;
};

OrgChart.local._getLeftmost = function (node, level, maxlevel) {
  if (level >= maxlevel) return node;
  if (!OrgChart.local._hasChildren(node)) return null;

  var n = node.children.length;
  for (var i = 0; i < n; i++) {
      var iChild = node.children[i];
      var leftmostDescendant = OrgChart.local._getLeftmost(iChild, level + 1, maxlevel);
      if (leftmostDescendant != null)
          return leftmostDescendant;
  }

  return null;
};

OrgChart.local.nodeHasPartnersPosition = function (node, config, maxsizeTmp) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          var lpw = OrgChart.local._getPartnerLeftPanelWidth(node, config);
          node.x += lpw;        
          
          if (node.h < maxsizeTmp){                
              if (config.orientation == OrgChart.orientation.bottom || config.orientation == OrgChart.orientation.bottom_left){                    
                  node.y -= ((maxsizeTmp - node.h) / 2);  
              }
              else{                    
                  node.y += ((maxsizeTmp - node.h) / 2);  
              }
          }
          break;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          var lph = OrgChart.local._getPartnerLeftPanelHeight(node, config);        
          node.x += lph;       
          
          if (node.w < maxsizeTmp){
              if (config.orientation == OrgChart.orientation.right || config.orientation == OrgChart.orientation.right_top){
                  node.y -= ((maxsizeTmp - node.w) / 2);    
              }
              else{
                  node.y += ((maxsizeTmp - node.w) / 2);    
              }
          }
          break;
  }
}

OrgChart.local.nodeIsPartnerPosition = function (node, config, maxLevelHeightArr, level) {
  var h_left = 0;
  var h_right = 0;

  var partnerRightX = 0;
  var partnerRightY = 0;
  var partnerLeftX = 0;
  var partnerLeftY = 0;
  
  var prevLeftH = 0;
  var prevRightH = 0;

  var isFirstRightPartner = true;
  var isFirstLeftPartner = true;

  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          h_left = OrgChart.local._getPartnerLeftPanelHeight(node.parent, config);
          h_right = OrgChart.local._getPartnerRightPanelHeight(node.parent, config);
          for (var i = 0; i < node.parent.children.length; i++){
              var cnode = node.parent.children[i];
              if (cnode.isPartner == 1){
                  partnerRightX = node.parent.x + node.parent.w + node.parent.partnerSeparation ;
                  if (isFirstRightPartner){                        
                      partnerRightY = (node.parent.y - ((maxLevelHeightArr[level - 1] - node.parent.h) / 2)) + ((maxLevelHeightArr[level - 1] - h_right) / 2) ; 
                      prevRightH = cnode.h;
                      isFirstRightPartner = false;
                  }
                  else{
                      partnerRightY += (prevRightH + config.partnerNodeSeparation);
                      prevRightH = cnode.h;
                  }
                  cnode.x = partnerRightX;
                  cnode.y = partnerRightY;
              }
              else if (cnode.isPartner == 2){
                  partnerLeftX = node.parent.x - cnode.w - node.parent.partnerSeparation;
                  if (isFirstLeftPartner){
                      partnerLeftY = node.parent.y - ((maxLevelHeightArr[level - 1] - node.parent.h) / 2) + ((maxLevelHeightArr[level - 1] - h_left) / 2);  
                      prevLeftH = cnode.h;
                      isFirstLeftPartner = false;
                  }
                  else{
                      partnerLeftY += (prevLeftH + config.partnerNodeSeparation);
                      prevLeftH = cnode.h;
                  }
                  cnode.x = partnerLeftX;
                  cnode.y = partnerLeftY;
              }           
          }   
          break;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          h_left = OrgChart.local._getPartnerLeftPanelWidth(node.parent, config);
          h_right = OrgChart.local._getPartnerRightPanelWidth(node.parent, config);
      
          for (var i = 0; i < node.parent.children.length; i++){
              var cnode = node.parent.children[i];
              if (!cnode) continue;
              if (cnode.isPartner == 1){
                  partnerRightY = node.parent.y + node.parent.h + node.parent.partnerSeparation;
                  if (isFirstRightPartner){
                      partnerRightX = (node.parent.x - ((maxLevelHeightArr[level - 1] - node.parent.w) / 2)) + ((maxLevelHeightArr[level - 1] - h_right) / 2) ; 
                      prevRightH = cnode.w;
                      isFirstRightPartner = false;
                  }
                  else{
                      partnerRightX += (prevRightH + config.partnerNodeSeparation);
                      prevRightH = cnode.w;
                  }
                  cnode.x = partnerRightX;
                  cnode.y = partnerRightY;
              }
              else if (cnode.isPartner == 2){
                  partnerLeftY = node.parent.y - cnode.h - node.parent.partnerSeparation;
                  if (isFirstLeftPartner){
                      partnerLeftX = node.parent.x - ((maxLevelHeightArr[level - 1] - node.parent.w) / 2) + ((maxLevelHeightArr[level - 1] - h_left) / 2);  
                      prevLeftH = cnode.w;
                      isFirstLeftPartner = false;
                  }
                  else{
                      partnerLeftX += (prevLeftH + config.partnerNodeSeparation);
                      prevLeftH = cnode.w;
                  }
                  cnode.x = partnerLeftX;
                  cnode.y = partnerLeftY;
              }           
          }   
          break;
  }    
}


OrgChart.local._getPartnerRightPanelWidth = function (node, config) {
  if (!node.hasPartners){
      return 0;
  }
  var w = 0;
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:                
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 1 && cnode.w > w){
                  w = cnode.w;
              }
          }                        
  
          if (w){
              w += node.partnerSeparation;
          }        
          return w;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 1){
                  w += cnode.w + config.partnerNodeSeparation;
              }
          }                           

          if (w){
              w -= config.partnerNodeSeparation;
          }          

          return w;
          
  }
};


OrgChart.local._getPartnerLeftPanelWidth = function (node, config) {
  if (!node.hasPartners){
      return 0;
  }
  var w = 0;
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:                
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 2 && cnode.w > w){
                  w = cnode.w;
              }
          }                        
  
          if (w){
              w += node.partnerSeparation;
          }        
          return w;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 2){
                  w += cnode.w + config.partnerNodeSeparation;
              }
          }                           

          if (w){
              w -= config.partnerNodeSeparation;
          }          

          return w;
  }
};



OrgChart.local._getPartnerRightPanelHeight = function (node, config) {
  if (!node.hasPartners){
      return 0;
  }
  var h = 0;
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:                
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 1){
                  h += cnode.h + config.partnerNodeSeparation;
              }
          }                           

          if (h){
              h -= config.partnerNodeSeparation;
          }          

          return h;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:            
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 1 && cnode.h > h){
                  h = cnode.h;
              }
          }                        
  
          if (h){
              h += node.partnerSeparation;
          }        
          return h;    
  }
};


OrgChart.local._getPartnerLeftPanelHeight = function (node, config) {
  if (!node.hasPartners){
      return 0;
  }
  var h = 0;
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:                
          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 2){
                  h += cnode.h + config.partnerNodeSeparation;
              }
          }                           

          if (h){
              h -= config.partnerNodeSeparation;
          }          

          return h;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:

          for (var i = 0; i < node.children.length; i++){
              var cnode = node.children[i];
              if (cnode.isPartner == 2 && cnode.h > h){
                  h = cnode.h;
              }
          }                        
  
          if (h){
              h += node.partnerSeparation;
          }        
          return h;
  }
};


OrgChart.local._fChild = function (node) {
  var index  = 0;

  while(index < node.children.length && node.children[index].isPartner){
      index++;
  }

  return node.children[index];
}

OrgChart.local._hasChildren = function (node) {
  for(var i = 0; i < node.children.length; i++)
      if (!node.children[i].isPartner)
          return true

  
  return false;
}







OrgChart.searchUI = function () {
};

OrgChart.searchUI.prototype.init = function (obj) {
  this.obj = obj;
};

OrgChart.searchUI.prototype.hide = function () {
  var search = this.obj.element.querySelector('[data-id="search"]');
  if (!search) {
      return;
  }
  var searchCell1 = search.querySelector('[data-id="cell-1"]');
  var input = this.obj.element.getElementsByTagName("input")[0];
  var container = this.obj.element.querySelector('[data-id="container"]');

  input.value = "";
  container.innerHTML = "";

  if (searchCell1.style.display != "none" && search.style.display != "none") {
      OrgChart.anim(searchCell1, { opacity: searchCell1.style.opacity }, { opacity: 0 }, 200, OrgChart.anim.inOutSin, function () {
          searchCell1.style.display = "none";
          OrgChart.anim(search, { width: 300, opacity: 1 }, { width: 50, opacity: 0 }, 300, OrgChart.anim.inBack, function () {
              search.style.display = "none";
          });
      });
  }
};

OrgChart.searchUI.prototype.show = function (callback) {
  var search = this.obj.element.querySelector('[data-id="search"]');
  var searchCell1 = search.querySelector('[data-id="cell-1"]');

  searchCell1.style.display = "none";
  search.style.width = "50px";
  search.style.display = "block";
  search.style.opacity = 0;

  OrgChart.anim(search, { width: 50, opacity: 0 }, { width: 300, opacity: 1 }, 300, OrgChart.anim.outBack, function () {
      searchCell1.style.display = "inherit";
      searchCell1.style.opacity = 0;        
      OrgChart.anim(searchCell1, { opacity: 0 }, { opacity: 1 }, 200, OrgChart.anim.inOutSin);
      if (callback)
          callback();
  });
};

OrgChart.searchUI.prototype.addSearchControl = function () {
  var that = this;

  var div = document.createElement("div");
  div.innerHTML = OrgChart.searchUI.createSearchIcon(this.obj.config.padding);

  div.innerHTML += OrgChart.searchUI.createInputField(this.obj.config.padding);
  this.obj.element.appendChild(div);

  var searchIcon = this.obj.element.querySelector('[data-id="search-icon"]');
  var search = this.obj.element.querySelector('[data-id="search"]');
  var input = this.obj.element.getElementsByTagName("input")[0];

  searchIcon.addEventListener("mouseover", function () {
      that.show();
  });

  search.addEventListener("mouseleave", function () {        
      if (document.activeElement == input) {
          return;
      }
      that.hide();    
  });

  search.addEventListener("click", function () {
      input.focus();
  });

  //Start fix : FW: Issues with research and the links between nodes in the organigram
  input.addEventListener("keypress", function (e) {
      if (e.keyCode == 13) {//enter            
          e.preventDefault();
      }
  });
  //End fix

  input.addEventListener("keyup", function (e) {       
      if (e.keyCode == 40) {//arrow down
          searchTableRowDown();
      }
      else if (e.keyCode == 38) {//arrow up
          searchTableRowUp();
      }
      else if (e.keyCode == 13) {//enter            
          searchTableSelectEnter();
      }
      else if (e.keyCode == 27) {//escape
          that.hide();
      }
      else {
          that._serverSearch(this.value);
      }
  });

  var searchTableRowDown = function () {
      var itemElements = search.querySelectorAll("[data-search-item-id]");

      var selectedItem = search.querySelector('[data-selected="yes"]')
      if (selectedItem == null && itemElements.length > 0) {
          itemElements[0].setAttribute("data-selected", "yes");
          itemElements[0].style.backgroundColor = "#F0F0F0";  
      }
      else if (itemElements.length > 0) {
          if (selectedItem.nextSibling) {
              selectedItem.setAttribute("data-selected", "no");
              selectedItem.style.backgroundColor = "inherit";  
              selectedItem.nextSibling.setAttribute("data-selected", "yes");
              selectedItem.nextSibling.style.backgroundColor = "#F0F0F0";
          }
      }
  };

  var searchTableRowUp = function () {
      var itemElements = search.querySelectorAll("[data-search-item-id]");

      var selectedItem = search.querySelector('[data-selected="yes"]')
      if (selectedItem == null && itemElements.length > 0) {
          itemElements[itemElements.length - 1].setAttribute("data-selected", "yes");
          itemElements[itemElements.length - 1].style.backgroundColor = "#F0F0F0";
      }
      else if (itemElements.length > 0){
          if (selectedItem.previousSibling) {
              selectedItem.setAttribute("data-selected", "no");
              selectedItem.style.backgroundColor = "inherit";
              selectedItem.previousSibling.setAttribute("data-selected", "yes");
              selectedItem.previousSibling.style.backgroundColor = "#F0F0F0";
          }
      }
  };

  var searchTableSelectEnter = function () {
      var selectedItem = search.querySelector('[data-selected="yes"]');
      if (!selectedItem){
          return;
      }
      var id = selectedItem.getAttribute("data-search-item-id");

      var fireEvent = OrgChart.events.publish('searchclick', [that.obj, id]);
      if (fireEvent == undefined || fireEvent == true) {
          that.obj.center(id);
      }
  };
};

OrgChart.searchUI.prototype.find = function (value) {
  var that = this;
  this.show(function () {
      var input = that.obj.element.getElementsByTagName("input")[0];
      input.value = value;
      that._serverSearch(value);
      input.focus();
  });
};

OrgChart.searchUI.prototype._serverSearch = function (value) {
  var that = this;
  var container = this.obj.element.querySelector('[data-id="container"]');
  var search = this.obj.element.querySelector('[data-id="search"]');

 
  var result = OrgChart._search.search(
      this.obj.config.nodes,
      value,
      this.obj.config.searchFields,
      this.obj.config.searchFields,
      this.obj.config.searchDisplayField,
      this.obj.config.searchFieldsWeight
  );


  var imgFiled = OrgChart._getFistImgField(this.obj.config);

  var html = "";
  for (var i = 0; i < result.length; i++) {
      if (i >= OrgChart.SEARCH_RESULT_LIMIT ){
          break;
      }

      var item = result[i];

      var img = "";
      if (imgFiled){
          var data = this.obj._get(item.id);
          if (typeof(imgFiled) == 'function'){
              img = imgFiled(this.obj, this.obj.getNode(item.id), data);
          }
          else if(data[imgFiled]){
              img = data[imgFiled];
          }
          if (img){
              img = '<img style="padding: 2px 0px  2px 7px;width:32px;height:32px;" src="' + img + '" / >';
          }
      }

      var first = '';
      var second = '';
      if (this.obj.config.searchDisplayField == item.__searchField){
          first = item.__searchMarks;
      }
      else if (this.obj.config.searchDisplayField){
          first = item[this.obj.config.searchDisplayField];
          if (OrgChart.isNullOrEmpty(first)){
              first = '';
          }
          second = item.__searchMarks;
      }
      else{
          first= item.__searchMarks;
      }
      html += OrgChart.searchUI.createItem(img, item.id, first, second);      
  }

  container.innerHTML = html;

  var itemElements = search.querySelectorAll("[data-search-item-id]");
  for (var i = 0; i < itemElements.length; i++) {
      itemElements[i].addEventListener("click", function () {

          var fireEvent = OrgChart.events.publish('searchclick', [that.obj, this.getAttribute("data-search-item-id")]);
          
          if (fireEvent == undefined || fireEvent == true) {
              that.obj.center(this.getAttribute("data-search-item-id"));
          }
      });
      itemElements[i].addEventListener("mouseover", function () {
          this.setAttribute("data-selected", "yes");
          this.style.backgroundColor = "#F0F0F0";
      });

      itemElements[i].addEventListener("mouseleave", function () {
          this.style.backgroundColor = "inherit";
          this.setAttribute("data-selected", "no");
      });
  }
};


OrgChart.searchUI.createInputField = function (p) {
  return '<div data-id="search" style="display:none;border-radius: 20px 20px;padding:5px; box-shadow: #808080 0px 1px 2px 0px; font-family:Roboto-Regular, Helvetica;color:#7a7a7a;font-size:14px;border:1px solid #d7d7d7;width:300px;position:absolute;top:' + p + 'px;left:' + p + 'px;background-color:#ffffff;">'
      + '<div>'
      + '<div style="float:left;">'
      + OrgChart.icon.search(32, 32, '#757575')
      + '</div>'
      + '<div data-id="cell-1" style="float:right; width:83%">'
      + '<input placeholder="' + OrgChart.SEARCH_PLACEHOLDER + '" style="font-size:14px;font-family:Roboto-Regular, Helvetica;color:#7a7a7a;width:100%;border:none;outline:none; padding-top:10px;" type="text" />'
      + '</div>'
      + '<div style="clear:both;"></div>'
      + '</div>'
      + '<div data-id="container"></div>'
      + '</div>'
};

OrgChart.searchUI.createItem = function (img, id, first, second) {
  return '<div data-search-item-id="' + id + '" style="border-top:1px solid #d7d7d7; padding: 7px 0 7px 0;cursor:pointer;">'
      + '<div style="float:left;">'
      + img
      + '</div>'
      + '<div style="float:right; width:83%">'
      + '<div style="overflow:hidden; white-space: nowrap;text-overflow:ellipsis;text-align:left;">' + first + '</div>'
      + '<div style="overflow:hidden; white-space: nowrap;text-overflow:ellipsis;text-align:left;">' + second + '</div>'
      + '</div>'
      + '<div style="clear:both;"></div>'
      + '</div>';
};

OrgChart.searchUI.createSearchIcon = function (p) {
  return '<div data-id="search-icon" style="padding:5px; position:absolute;top:' + p + 'px;left:' + p + 'px;border:1px solid transparent;">'
      + '<div>'
      + '<div style="float:left;">'
      + OrgChart.icon.search(32, 32, '#757575')
      + '</div>'
      + '</div>'
      + '</div>'
};

if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.server = function (config, layoutConfigs) {
  this.config = config;
  this.layoutConfigs = layoutConfigs;
  this.visibleNodeIds = [];
  this.viewBox = null;
  this.action = null;
  this.actionParams = null;
  this.nodes = {};
  this.oldNodes = {};
  this.maxX = null;
  this.maxY = null;
  this.minX = null;
  this.minY = null;
  this.bordersByRootIdAndLevel = null;
  this.roots = null;
  this.state = null;
  this.vbIsInitializedFromState = false;
};

OrgChart.server.prototype.read = function (readFromCache, width, height, viewBox, action, actionParams, callback, readyCallback) {
  var that = this;

  OrgChart.state._get(this.config.state, width, height, function(state){
      that.state = state; 
      that.action = action;
      that.actionParams = actionParams;
      
      //START: TEST STATE FEATURE IF CHANGE
      if (action == OrgChart.action.init && that.state){            
          that.viewBox = that.state.vb;
          that.vbIsInitializedFromState = true;
      }   
      else{
          that.viewBox = viewBox;
          that.vbIsInitializedFromState = false;
      }       
      //END: TEST STATE FEATURE IF CHANGE
  
      var maxX = that.maxX;
      var maxY = that.maxY;
      var minX = that.minX;
      var minY = that.minY;
      var bordersByRootIdAndLevel = that.bordersByRootIdAndLevel;
      var roots = that.roots;
      var nodes = that.nodes;
  
      if (!readFromCache) {
          if (nodes) {
              that.oldNodes = nodes;//clone
          }
          else {
              that.oldNodes = null;
          }
          that._read(function(result){
              maxX = result.maxX;
              maxY = result.maxY;
              minX = result.minX;
              minY = result.minY;
              bordersByRootIdAndLevel = result.bordersByRootIdAndLevel;
              roots = result.roots;
              nodes = result.nodes;
  
              var response = OrgChart.server._getResponse(
                  width,
                  height,
                  that.visibleNodeIds,
                  that.config,
                  maxX,
                  maxY,
                  minX,
                  minY,
                  that.viewBox,
                  roots,
                  that.action,
                  that.actionParams,
                  nodes,
                  that.oldNodes,
                  that.vbIsInitializedFromState);
  
              response.notif = result.limit;        
              
              response.roots = roots;
              response.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
              response.adjustify = result.adjustify;
  
              if (action != OrgChart.action.exporting) {
                  that.maxX = maxX;
                  that.maxY = maxY;
                  that.minX = minX;
                  that.minY = minY;
                  that.roots = roots;
                  that.nodes = nodes;
                  that.visibleNodeIds = response.visibleNodeIds;
                  that.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
              }    
          
              callback(response);
          }, readyCallback);
      }
      else{
          var response = OrgChart.server._getResponse(
              width,
              height,
              that.visibleNodeIds,
              that.config,
              maxX,
              maxY,
              minX,
              minY,
              that.viewBox,
              roots,
              that.action,
              that.actionParams,
              nodes,
              that.oldNodes, 
              that.vbIsInitializedFromState);
      
          if (action != OrgChart.action.exporting) {
              that.maxX = maxX;
              that.maxY = maxY;
              that.minX = minX;
              that.minY = minY;
              that.roots = roots;
              that.nodes = nodes;
              that.visibleNodeIds = response.visibleNodeIds;
          }
  
          response.bordersByRootIdAndLevel = bordersByRootIdAndLevel;
          response.roots = roots;    

          //START: TEST STATE FEATURE IF CHANGE
          response.adjustify = {x: 0, y: 0};                
          if (that.state){
              response.adjustify = that.state.adjustify;
          }
          //END: TEST STATE FEATURE IF CHANGE
       
          callback(response);
      }
  });
  
};

OrgChart.server.prototype._read = function (callback, readyCallback) {
  var that = this;
      var result = OrgChart.server._createNodes(that.config, that.layoutConfigs, that.action, that.actionParams, that.oldNodes, that.state);
      readyCallback(result);
      var nodes = result.nodes;
      var roots = result.roots;
      var service = OrgChart.remote;
  
      if (service == undefined){
          service = OrgChart.local;
      }    
      
      service._setPositions(roots, that.layoutConfigs, function(limit){    
          //START: TEST STATE FEATURE IF CHANGE  
          var adjust = OrgChart.server._doNotChangePositionOfClickedNodeIfAny(roots, nodes, that.action, that.actionParams, that.oldNodes, that.config.orientation);         
          if (that.state && that.action == OrgChart.action.init){
              adjust = that.state.adjustify;
          }
          //END: TEST STATE FEATURE IF CHANGE
          
          var border = {
              minX: null,
              minY: null,
              maxX: null,
              maxY: null
          };        
          
          var bordersByRootIdAndLevel = {};
          for(var i = 0; i < roots.length; i++){
              OrgChart.server._setMinMaxXYAdjustifyIterate(roots[i], roots[i], border, 0, bordersByRootIdAndLevel, adjust, that.config.orientation);
          }
  
          callback({
              minX: border.minX,
              minY: border.minY,
              maxX: border.maxX,
              maxY: border.maxY,
              bordersByRootIdAndLevel: bordersByRootIdAndLevel,
              nodes: nodes,
              roots: roots,
              limit: limit,
              adjustify: adjust
          });
      }, nodes);
   
};



if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}



OrgChart.server._initDinamicNode = function (node, lcn, isAssistant) {
  if (lcn) {
      node.lcn = lcn;
  }
  if (isAssistant) {
      node.isAssistant = true;
  }
  var t = OrgChart.t(node.templateName);
  node.w = t && t.size ? t.size[0] : 0;
  node.h = t && t.size ? t.size[1] : 0;
  node.isSplit = node.templateName == "split";
};

OrgChart.server._setCollpasedProperty = function (node, lconfig, actionParams, expandedNodeIds, action, level, state) {    
  if (node.collapsed == undefined && lconfig.collapse && lconfig.collapse.allChildren) {        
      node.collapsed = true;
  }
  else if (node.collapsed == undefined){
      node.collapsed = false;
  }
  if (action == OrgChart.action.expand && actionParams.ids.indexOf(node.id) != -1) {
      node.collapsed = false;
  }
  if (action == OrgChart.action.collapse && (actionParams.expandIds || actionParams.collapseIds)) {
      if (actionParams.expandIds && actionParams.expandIds.indexOf(node.id) != -1) {
          node.collapsed = false;
      }
      else if (actionParams.collapseIds && actionParams.collapseIds.indexOf(node.id) != -1){
          node.collapsed = true;
      }
  }
  else if (action == OrgChart.action.collapse && actionParams.ids.indexOf(node.id) != -1) {
      node.collapsed = true;
  }
  if (action == OrgChart.action.expand && actionParams.ids == "all") {
      node.collapsed = false;
  }
  if (action == OrgChart.action.exporting && actionParams.expandChildren) {
      node.collapsed = false;
  }
  
  if (action == OrgChart.action.init && state != null) {
      node.collapsed = !state.exp.has(node.id);
  }
  else if (action == OrgChart.action.init) {
      node.collapsed = (lconfig.collapse && level >= lconfig.collapse.level - 1) && (expandedNodeIds.indexOf(node.id) == -1);
  }
  else if (action == OrgChart.action.centerNode || action == OrgChart.action.insert) {
      if (expandedNodeIds.indexOf(node.id) != -1) {
          node.collapsed = false;
      }
  }  
};


OrgChart.server._initNode = function (node, nodes, layoutConfigName, level, action, layoutConfigs, config, expandedNodeIds, actionParams, partnerIds, state) {    
  var lcname = layoutConfigName ? layoutConfigName : "base";
  var lconfig = layoutConfigs[lcname];

  if (node.parent == null){
      OrgChart.server._setCollpasedProperty(node, lconfig, actionParams, expandedNodeIds, action, level - 1, state);      
  }

  for (var i = 0; i < node.childrenIds.length; i++) {
      var cnode = nodes[node.childrenIds[i]];

      //start expand collapse logic
      OrgChart.server._setCollpasedProperty(cnode, lconfig, actionParams, expandedNodeIds, action, level, state);      
      //end expand collapse logic

      if (!cnode.collapsed) {
          cnode.parent = node;
          if ((cnode.tags.indexOf("left-partner") != -1) || (cnode.tags.indexOf("right-partner") != -1) || (cnode.tags.indexOf("partner") != -1) || cnode.ppid != undefined) {
              if (partnerIds.indexOf(node.id) == -1){
                  partnerIds.push(node.id);
              }
          } 
          node.children.push(cnode);            
      }
  }  

  if (!node.min && action == OrgChart.action.minimize && actionParams.id == node.id) {
      node.min = true; 
  }
  if (node.min === true && action == OrgChart.action.maximize && actionParams.id == node.id) {
      node.min = false;
  }    
  if (action == OrgChart.action.init && state != null){
      node.min = state.min.has(node.id);
  }

  if (!node.min) {
      for (var i = 0; i < node.stChildrenIds.length; i++) {
          var cnode = nodes[node.stChildrenIds[i]];    
          cnode.stParent = node;
          node.stChildren.push(cnode);        
      }
  }
  
  var t = OrgChart.t(node.templateName, node.min);    

  node.w = t && t.size ? t.size[0] : 0;
  node.h = t && t.size ? t.size[1] : 0;


  node.padding = t && t.padding ? t.padding : [0,0,0,0];


  if (level != undefined) {
      node.level = level;
  }

  if (layoutConfigName) {
      node.lcn = layoutConfigName;
  }

  var subLevels = OrgChart._getSubLevels(node.tags, config.tags);
  if (subLevels > 0) {
      node.subLevels = subLevels;
  }

  if (node.tags.indexOf("assistant") != -1 && node.parent != null) {
      node.isAssistant = true;
  }

  OrgChart.events.publish('node-created', [node]);
}

OrgChart.server._iterate = function (root, node, nodes, level, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, layoutConfigName, layoutConfigs, config, action, expandedNodeIds, actionParams, partnerIds, state) {

  OrgChart.server._initNode(node, nodes, layoutConfigName, level, action, layoutConfigs, config, expandedNodeIds, actionParams, partnerIds, state);

  if (node.isAssistant) {
      if (!assistantPidIds[node.pid]) {
          assistantPidIds[node.pid] = [];
      }
      assistantPidIds[node.pid].push(node.id);
  }

  if (node.subLevels > 0) {
      subLevelsIds.push(node.id);
  }

  if (!node.isAssistant && node.childrenIds.length == 0 && node.parent) {
      if (!lastChildrenPidIds[node.pid]) {
          var lastChildrenArr = [];
          var assistantChildrenCount = 0;
          var partnerChildrenCount = 0;
          for (var j = 0; j < node.parent.children.length; j++) {
              var lnode = node.parent.children[j];
              if (lnode.tags.indexOf("partner") == -1 && lnode.tags.indexOf("assistant") == -1 && lnode.childrenIds.length == 0) {
                  lastChildrenArr.push(lnode.id);
              }
              else if (lnode.tags.indexOf("assistant") != -1) {                    
                  assistantChildrenCount++;
              }
              else if (lnode.tags.indexOf("partner") != -1) {                    
                  partnerChildrenCount++;
              }
          }

          // if (assistantChildrenCount){
          //     lastChildrenArr = [];
          // }

          if (OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1 && lastChildrenArr.length == node.parent.childrenIds.length - assistantChildrenCount - partnerChildrenCount) {
              lastChildrenPidIds[node.pid] = lastChildrenArr;
          }
          else if (!OrgChart.MIXED_LAYOUT_ALL_NODES && lastChildrenArr.length > 1) {

              lastChildrenPidIds[node.pid] = lastChildrenArr;
          }
      }
  }

  if (node.stChildren.length) {
      if (!root.stContainerNodes) {
          root.stContainerNodes = [];
      }
      root.stContainerNodes.push(node);
  }

  for (var i = 0; i < node.stChildren.length; i++) {
      var lcn = "";
      for (var j = 0; j < node.tags.length; j++) {
          if (layoutConfigs[node.tags[j]]) {
              lcn = node.tags[j];
              break;
          }
      }
      
      subTreeIds.push(node.stChildren[i].id);
      OrgChart.server._iterate(root, node.stChildren[i], nodes, 0, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, lcn, layoutConfigs, config, action, expandedNodeIds, actionParams, partnerIds, state);
  }

  level++;

  for (var i = 0; i < node.children.length; i++) {
      OrgChart.server._iterate(root, node.children[i], nodes, level, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, layoutConfigName, layoutConfigs, config, action, expandedNodeIds, actionParams, partnerIds, state);
  }

};


OrgChart.server._createNodes = function (config, layoutConfigs, action, actionParams, oldNodes, state) {
  var data = config.nodes;
  var nodes = {};
  var nodeIds = [];
  var roots = [];


  for (var i = 0; i < data.length; i++) {
      var d = data[i];

      var tags;
      if (OrgChart.STRING_TAGS){
          tags = d.tags ? d.tags.split(',') : []
      }
      else{
          tags = Array.isArray(d.tags) ? d.tags.slice(0) : [];
      }
      var templateName = OrgChart._getTemplate(tags, config.tags, config.template);
      var node = new OrgChart.node(d.id, d.pid, tags, templateName); 

      if (d.ppid != undefined){
          node.ppid = d.ppid;
      }



      if (d.stpid) {
          node.stpid = d.stpid;
      }

      if (config.orderBy != null) {
          node.order = OrgChart.server._getOrderFieldValue(d, config.orderBy);
      }
      nodes[d.id] = node;
      nodeIds.push(d.id);
  }

  //start order
  if (config.orderBy != null) {
      nodeIds.sort(function (a, b) {
          var an = nodes[a].order;
          var bn = nodes[b].order;

          if (typeof (an) == "number" || typeof (bn) == "number") {
              if (an == undefined) {
                  an = -1;
              }
              if (bn == undefined) {
                  bn = -1;
              }
              if (config.orderBy.desc) {
                  return bn - an;
              }
              else {
                  return an - bn;
              }
          }
          else if (typeof (an) == "string" || typeof (bn) == "string") {
              if (an == undefined) {
                  an = "";
              }
              if (bn == undefined) {
                  bn = "";
              }
              if (config.orderBy.desc) {
                  return bn.localeCompare(an);
              }
              else {
                  return an.localeCompare(bn);
              }

          }
      });
  }
  //end start order

  for (var i = 0; i < nodeIds.length; i++) {
      var id = nodeIds[i];
      var node = nodes[id];
      var oldNode = oldNodes ? oldNodes[id] : null;

      var stpnode = nodes[node.stpid];
      var pnode = nodes[node.pid];

      if (!stpnode) {
          node.stpid = null;
      }

      if (!pnode) {
          node.pid = null;
      }

      if (stpnode) {
          var stOldNode = oldNodes ? oldNodes[stpnode.id] : null;

          if (stOldNode) {
              stpnode.min = stOldNode.min;                
          }               

          stpnode.stChildrenIds.push(node.id);
      }
      else if (pnode) {
          if (oldNode){
              node.collapsed = oldNode.collapsed;
              node.min = oldNode.min;
          }
          pnode.childrenIds.push(node.id);
      }
      else {
          if (oldNode){
              node.collapsed = oldNode.collapsed;
              node.min = oldNode.min;
          }
          roots.push(node);
      }    

      
      if (action == OrgChart.action.init) {
          node.min = OrgChart._getMin(node, config);
      }  
  }


  if (config.roots != null) {
      roots = [];
      for(var i = 0; i < config.roots.length; i++){
          var root = nodes[config.roots[i]];
          if (root){
              roots.push(root);
          }
      }        
  }

  if (action == OrgChart.action.exporting && actionParams.id != undefined) {
      var node = nodes[actionParams.id];
      if (node){
          node.pid = null;
          //OrgChart.server._setStContainerNodesForRoot(node, node);
          roots = [node];
      }
  }





  //start expand collapse logic
  var expandedNodeIds = [];
  //TEST STATE FEATURE IF CHANGE THE IF BELOW
  if (action == OrgChart.action.init  && config.expand && config.expand.nodes && state == null) {
      for (var i = 0; i < config.expand.nodes.length; i++) {
          var node = nodes[config.expand.nodes[i]];

          while (node) {
              expandedNodeIds.push(node.id);
              if (node.pid == null && node.stpid != null){
                  node = nodes[node.stpid];                 
                  node.min = false;
              }
              else{                
                  node = nodes[node.pid]; 
              }
          }
      }
  }
  else if (action == OrgChart.action.centerNode) {
      var centerNode = nodes[actionParams.id];
      while (centerNode) {
          expandedNodeIds.push(centerNode.id);
          if (actionParams.options.parentState === OrgChart.COLLAPSE_PARENT_NEIGHBORS) {
              if (centerNode) {
                  for (var i = 0; i < centerNode.childrenIds.length; i++) {
                      var cnode = nodes[centerNode.childrenIds[i]];
                      cnode.collapsed = true;
                  }
              }
          }
          if (centerNode.pid == null && centerNode.stpid != null){
              centerNode = nodes[centerNode.stpid];                 
              centerNode.min = false;
          }
          else{                
              centerNode = nodes[centerNode.pid]; 
          }
      }

      var centerNode = nodes[actionParams.id];
      if (actionParams.options.childrenState === OrgChart.COLLAPSE_SUB_CHILDRENS) {
          for (var i = 0; i < centerNode.childrenIds.length; i++) {
              var c1node = nodes[centerNode.childrenIds[i]];
              c1node.collapsed = false;
              for (var j = 0; j < c1node.childrenIds.length; j++) {
                  var c2node = nodes[c1node.childrenIds[j]];
                  c2node.collapsed = true;
              }
          }
      }
      if (actionParams.options.parentState === OrgChart.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED) {
          var pnode = nodes[centerNode.pid];
          if (pnode){
              for (var i = 0; i < pnode.childrenIds.length; i++) {
                  var c1node = nodes[pnode.childrenIds[i]];
                  if (c1node != centerNode){
                      c1node.collapsed = false;
                      for (var j = 0; j < c1node.childrenIds.length; j++) {
                          var c2node = nodes[c1node.childrenIds[j]];
                          c2node.collapsed = true;
                      }
                  }             
              }
          }    
      }
  }
  else if (action == OrgChart.action.insert){

      var node = nodes[actionParams.insertedNodeId];

      while (node) {
          expandedNodeIds.push(node.id);
          if (node.pid == null && node.stpid != null){
              node = nodes[node.stpid];                 
              node.min = false;
          }
          else{                
              node = nodes[node.pid]; 
          }
      }
  }
  //end expand collapse logic

  var subTreeIds = [];
  var assistantPidIds = {};
  var subLevelsIds = [];
  var lastChildrenPidIds = {};
  var partnerIds = [];

  for (var i = 0; i < roots.length; i++) {
      OrgChart.server._iterate(roots[i], roots[i], nodes, 0, subTreeIds, assistantPidIds, subLevelsIds, lastChildrenPidIds, "", layoutConfigs, config, action, expandedNodeIds, actionParams, partnerIds, state);
  }

  for (var i = roots.length - 1; i >= 0; i--) {
      if (roots[i].collapsed){
          roots.splice(i, 1);
      }
  }

  //start partners
  for(var i = 0; i < partnerIds.length; i++) {
      var node = nodes[partnerIds[i]];        
      var childrenIds = []; //do not use node.childrenIds directly as it couild have collpased nodes
      var rightPartnerIds = [];
      var leftPartnerIds = [];
      var ppidPartnerPpidIds = {};
      var evenChecker = 0;
      var leftNodesWithPpidCount = 0;
      var rightNodesWithPpidCount = 0;

      var rightPartnersWithChildrenIds = [];
      var leftPartnersWithChildrenIds = [];
      
      for(var j = 0; j < node.children.length; j++){
          var cnode = node.children[j];
          
          if (!cnode.isAssistant){
              if (cnode.tags.indexOf('right-partner') != -1){
                  cnode.isPartner = 1;                                           
                  cnode.children = [];
                  rightPartnerIds.push(cnode.id);
              }            
              else if (cnode.tags.indexOf('left-partner') != -1){
                  cnode.isPartner = 2;
                  cnode.children = [];
                  leftPartnerIds.push(cnode.id);
              }    
              else if (cnode.tags.indexOf('partner') != -1 && !(evenChecker%2)){
                  cnode.isPartner = 1;
                  cnode.children = [];
                  rightPartnerIds.push(cnode.id);
                  evenChecker++;
              }
              else if (cnode.tags.indexOf('partner') != -1 && (evenChecker%2)){
                  cnode.isPartner = 2;
                  cnode.children = [];
                  leftPartnerIds.push(cnode.id);
                  evenChecker++;
              }                
              else if (cnode.ppid != undefined){        
                  if (!ppidPartnerPpidIds[cnode.ppid]){
                      ppidPartnerPpidIds[cnode.ppid] = [];
                  }                                 
                  ppidPartnerPpidIds[cnode.ppid].push(cnode.id);
               
              }
              else{
                  childrenIds.push(cnode.id);
              }
          }
      }
      
      node.children = [];

      for(var j = 0; j < rightPartnerIds.length; j++){
          var cnode = nodes[rightPartnerIds[j]];
          node.children.push(cnode);
      }
      
      for(var j = 0; j < leftPartnerIds.length; j++){
          var cnode = nodes[leftPartnerIds[j]];
          node.children.push(cnode);
      }

      for(var j = leftPartnerIds.length - 1; j >= 0 ; j--){
          if (ppidPartnerPpidIds[leftPartnerIds[j]]){
              for(var k = 0; k < ppidPartnerPpidIds[leftPartnerIds[j]].length; k++){              
                  node.children.push(nodes[ppidPartnerPpidIds[leftPartnerIds[j]][k]]);
                  leftNodesWithPpidCount++;

                  if (leftPartnersWithChildrenIds.indexOf(leftPartnerIds[j]) == -1){
                      leftPartnersWithChildrenIds.push(leftPartnerIds[j]);
                  }
              }
          }
      }

      for(var j = 0; j < childrenIds.length; j++){
          var cnode = nodes[childrenIds[j]];
          node.children.push(cnode);
      }        
         
      for(var j = 0; j < rightPartnerIds.length; j++){
          if (ppidPartnerPpidIds[rightPartnerIds[j]]){
              for(var k = 0; k < ppidPartnerPpidIds[rightPartnerIds[j]].length; k++){              
                  node.children.push(nodes[ppidPartnerPpidIds[rightPartnerIds[j]][k]]);
                  rightNodesWithPpidCount++;

                  if (rightPartnersWithChildrenIds.indexOf(rightPartnerIds[j]) == -1){
                      rightPartnersWithChildrenIds.push(rightPartnerIds[j]);
                  }
              }
          }
      }

      node.partnerSeparation = Math.max(leftPartnersWithChildrenIds.length, rightPartnersWithChildrenIds.length) * config.partnerChildrenSplitSeparation + config.minPartnerSeparation;


      if (!childrenIds.length && leftNodesWithPpidCount && !rightNodesWithPpidCount){
          node.hasPartners = 2;
      }
      else if (!childrenIds.length && !leftNodesWithPpidCount && rightNodesWithPpidCount){
          node.hasPartners = 3;
      }        
      else if (!childrenIds.length && leftNodesWithPpidCount == 1 && rightNodesWithPpidCount == 1){
          node.hasPartners = 4;
      }
      else if (!childrenIds.length && !leftNodesWithPpidCount  && !rightNodesWithPpidCount){
          node.hasPartners = 5;
      }        
      else if (childrenIds.length && !leftNodesWithPpidCount  && !rightNodesWithPpidCount){
          node.hasPartners = 6;
      }
      else if (childrenIds.length && (leftNodesWithPpidCount  || rightNodesWithPpidCount)){
          node.hasPartners = 7;
      }
      else {            
          node.hasPartners = 1;       
      }
  }
  //end partners


  //start SubLevels
  for (var i = 0; i < subLevelsIds.length; i++) {        
      var node = nodes[subLevelsIds[i]];
      var configName = node.lcn ? node.lcn : "base";
      var layoutConfig = layoutConfigs[configName];
      if (layoutConfig.layout != OrgChart.normal &&  lastChildrenPidIds[node.pid]){ //Not set subLevels if the node is last child and has mixed layout
          continue;
      }
      for (var j = 0; j < node.subLevels; j++) {

          var slnode = new OrgChart.node(node.id + "_sub_level_index_" + j, node.pid, [], "subLevel");
          OrgChart.server._initDinamicNode(slnode, node.lcn);

          var pnode = node.parent;
          if (!pnode) continue; // probably root        


          var index = pnode.children.indexOf(node);
          if (index > -1) {
              pnode.children.splice(index, 1);
              pnode.children.splice(index, 0, slnode);
          }

          slnode.children.push(node);
          slnode.parent = pnode;
          node.parent = slnode;
          nodes[slnode.id] = slnode;
      }
  }
  //end SubLevels

  //start assistant change structure
  for (var pid in assistantPidIds) {
      var pnode = nodes[pid]; //parent node
      pnode.hasAssistants = true;

      var slnode = new OrgChart.node(pnode.id + "_split_0", pnode.id, ["assistant"], "split"); //last split node 
      OrgChart.server._initDinamicNode(slnode, pnode.lcn, true);


      nodes[slnode.id] = slnode;


      var anodeIds = [];//assistant node ids        

      for (var j = pnode.children.length - 1; j >= 0; j--) {
          var cnode = pnode.children[j]; //child node
          if (cnode.isAssistant) {
              cnode.parent = null;
              pnode.children.splice(j, 1);
              anodeIds.splice(0, 0, cnode.id);
          }
          else if(!cnode.isPartner){
              //cnode.pid = slnode.id;
              cnode.parent = slnode;
              slnode.children.unshift(cnode);
              pnode.children.splice(j, 1);
          }
      }

      if (anodeIds.length % 2) { //odd
          var lanode = nodes[anodeIds[anodeIds.length - 1]]; //last assistant node

          var mnode = new OrgChart.node(lanode.id + "_mirror", lanode.pid, [], "mirror"); //mirror node 
          OrgChart.server._initDinamicNode(mnode, lanode.lcn, true);
          lanode._m = mnode.id;
          mnode.isAssistant = true;
          mnode.w = lanode.w;
          mnode.h = lanode.h;
          nodes[mnode.id] = mnode;
          anodeIds.splice(anodeIds.length - 1, 0, mnode.id);
      }

      var autoIncrement = 1;

      for (var j = anodeIds.length - 1; j >= 0; j--) {
          if (j % 2 && j != anodeIds.length - 1) {//odd
              var snode = new OrgChart.node(pnode.id + "_split_" + autoIncrement, null, [], "split"); //split node 
              OrgChart.server._initDinamicNode(snode, pnode.lcn, true);

              nodes[snode.id] = snode;
              anodeIds.splice(j, 0, snode.id);
              autoIncrement++;
          }
          else if (j % 2) {
              anodeIds.splice(j, 0, slnode.id);
          }
      }


      for (var j = 0; j < anodeIds.length; j = j + 3) {
          var psnode = null;
          if (j == 0) {
              psnode = pnode;
          }
          else {
              psnode = nodes[anodeIds[j - 2]]; //parent split node
          }

          var fcnode = nodes[anodeIds[j]];
          var scnode = nodes[anodeIds[j + 1]];
          var tcnode = nodes[anodeIds[j + 2]];

          fcnode.parent = psnode;
          //fcnode.pid = psnode.id;

          scnode.parent = psnode;
          //scnode.pid = psnode.id;

          tcnode.parent = psnode;
          //tcnode.pid = psnode.id;

          psnode.children.push(fcnode);
          psnode.children.push(scnode);
          psnode.children.push(tcnode);
      }
  }
  //end assistant change structure 


  //start layout change structure
  var hasMixedLayout = false;
  for (var layoutConfigName in layoutConfigs) {
      var layoutConfig = layoutConfigs[layoutConfigName];
      if (layoutConfig.layout == OrgChart.mixed || layoutConfig.layout == OrgChart.tree || layoutConfig.layout == OrgChart.treeRightOffset || layoutConfig.layout == OrgChart.treeLeftOffset) {
          hasMixedLayout = true;
          break;
      }
  }

  if (hasMixedLayout) {
      for (var pid in lastChildrenPidIds) {
          var pnode = nodes[pid];
          var configName = pnode.lcn ? pnode.lcn : "base";
          var layoutConfig = layoutConfigs[configName];

          if (layoutConfig.layout == OrgChart.mixed || layoutConfig.layout == OrgChart.tree || layoutConfig.layout == OrgChart.treeRightOffset || layoutConfig.layout == OrgChart.treeLeftOffset) {
              var args = {
                  pnode: pnode,
                  layout: layoutConfig.layout,
                  childrenIds: lastChildrenPidIds[pid]
              };
              OrgChart.events.publish('layout', [args]);
              if (args.layout ==  OrgChart.mixed){                   
                  var cnodeIds = args.childrenIds;
                  for (var i = cnodeIds.length - 1; i >= 0; i--) {
                      var cnode = nodes[cnodeIds[i]];
                      pnode = cnode.parent;
                      cnode.layout = OrgChart.mixed;
                      if (i > 0) {
                          for (var j = pnode.children.length - 1; j >= 0; j--) {
                              if (cnode.id == pnode.children[j].id) {
                                  pnode.children.splice(j, 1);
                              }
                          }
                          var cpnode = nodes[cnodeIds[i - 1]]
                          cnode.parent = cpnode;
                          cnode.layout = OrgChart.mixed;
                          cpnode.children.push(cnode);
                      }
                  }
              }
              else if (args.layout == OrgChart.tree || args.layout == OrgChart.treeRightOffset || args.layout == OrgChart.treeLeftOffset){

                  var slnode = new OrgChart.node(pnode.id + "_split_0", pnode.id, [], "split"); //last split node    
                  OrgChart.server._initDinamicNode(slnode, pnode.lcn)
                  nodes[slnode.id] = slnode;
                  slnode.layout = OrgChart.tree;
      
                  var tnodeIds = [];//tree node ids        
      
                  for (var i = args.childrenIds.length - 1; i >= 0; i--) {
      
                      var cnode = nodes[args.childrenIds[i]];
      
                      for (var j = 0; j < pnode.children.length; j++) {
                          if (pnode.children[j].id == cnode.id) {
                              pnode.children.splice(j, 1);
                          }
                      }
                      cnode.parent = null;
                      cnode.layout = OrgChart.tree;
      
                      if (args.layout == OrgChart.treeRightOffset) {
                          tnodeIds.splice(0, 0, cnode.id);
                      }
                      if (args.layout == OrgChart.treeLeftOffset || args.layout == OrgChart.treeRightOffset) {
                          var tnode = new OrgChart.node(cnode.id + "_mirror", null, [], "mirror"); //mirror node 
                          OrgChart.server._initDinamicNode(tnode, cnode.lcn)
                          tnode.layout = OrgChart.tree;
                          nodes[tnode.id] = tnode;
                          tnodeIds.splice(0, 0, tnode.id);
                      }
      
                      if (args.layout != OrgChart.treeRightOffset) {
                          tnodeIds.splice(0, 0, cnode.id);
                      }
                  }
      
                  var autoIncrement = 1;
      
                  for (var j = tnodeIds.length - 1; j >= 0; j--) {
                      if (j % 2 && j != tnodeIds.length - 1) {//odd
                          var snode = new OrgChart.node(pnode.id + "_split_" + autoIncrement, null, [], "split"); //split node 
                          OrgChart.server._initDinamicNode(snode, pnode.lcn)
      
                          snode.layout = OrgChart.tree;
      
                          nodes[snode.id] = snode;
                          tnodeIds.splice(j, 0, snode.id);
                          autoIncrement++;
                      }
                      else if (j % 2) {
                          tnodeIds.splice(j, 0, slnode.id);
                      }
                  }
      
                  for (var j = 0; j < tnodeIds.length; j = j + 3) {
                      var psnode = null;
                      if (j == 0) {
                          psnode = pnode;
                      }
      
                      var fcnode = nodes[tnodeIds[j]];
                      var scnode = nodes[tnodeIds[j + 1]];
                      var tcnode = nodes[tnodeIds[j + 2]];
      
                      if (j != 0) {
                          psnode = nodes[tnodeIds[j - 3]]; //parent split node
                      }
                      if (j != 0 && !scnode) {
                          psnode = nodes[tnodeIds[j - 2]]; //parent split node
                      }
                      fcnode.parent = psnode;
                      psnode.children.push(fcnode);
      
                      if (scnode) {
                          if (j != 0) {
                              psnode = nodes[tnodeIds[j - 2]]; //parent split node
                          }
                          scnode.parent = psnode;
                          psnode.children.push(scnode);
                      }
      
                      if (tcnode) {
                          if (j != 0) {
                              psnode = nodes[tnodeIds[j - 1]]; //parent split node
                          }
                          tcnode.parent = psnode;
                          psnode.children.push(tcnode);
                      }
                  }
              }
          }
      }
  }
 //end tree layout change structure





  return {
      nodes: nodes,
      roots: roots
  };
};

OrgChart.server._getOrderFieldValue = function (dataItem, orderBy) {
  var orderByField = orderBy;
  if (orderBy.field) {
      orderByField = orderBy.field;
  }
  return dataItem[orderByField];
};

OrgChart.server._getNodeWidth = function (node, config) {
  switch (config.orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          return node.w;

      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          return node.h;
  }

  return 0;
};


OrgChart.server._isVisible = function (node, config, viewBox, action) {
  if (node.x == null || node.y == null) {
      return;
  }
  if (config.lazyLoading && action !== OrgChart.action.exporting) {
      function is_vizible(n, viewBox) {
          var x = n.x;
          var y = n.y;
          var w = n.w;
          var h = n.h;

          var viewBox_x1 = viewBox[0] - OrgChart.LAZY_LOADING_FACTOR;
          var viewBox_x2 = viewBox[2] + OrgChart.LAZY_LOADING_FACTOR + viewBox[0];
          var viewBox_y1 = viewBox[1] - OrgChart.LAZY_LOADING_FACTOR;
          var viewBox_y2 = viewBox[3] + OrgChart.LAZY_LOADING_FACTOR + viewBox[1];

          var visible = (x + w > viewBox_x1 && viewBox_x2 > x);
          if (visible) {
              visible = (y + h > viewBox_y1 && viewBox_y2 > y);
          }
          return visible;
      }

      if (is_vizible(node, viewBox)) {
          return true;
      }
      else {
          for (var i = 0; i < node.children.length; i++) {
              if (is_vizible(node.children[i], viewBox)) {
                  return true;
              }
          }
      }
      return false;
  }

  return true;
};



OrgChart.server.getAllFields = function (config) {
  var fields = [OrgChart.TAGS];

  for (var i in config.nodeBinding) {
      fields.push(config.nodeBinding[i]);
  }

  for (var i = 0; i < config.nodes.length; i++) {
      for (var j in config.nodes[i]) {
          if (j === OrgChart.ID) {
              continue;
          }
          if (j === OrgChart.TAGS) {
              continue;
          }
          if (j === OrgChart.NODES) {
              continue;
          }
          if (j === OrgChart.PID) {
              continue;
          }
          if (j === OrgChart.STPID) {
              continue;
          }
          if (config.nodeBinding[j]) {
              continue;
          }
          if (!OrgChart._arrayContains(fields, j)) {
              fields.push(j);
          }
      }
  }

  return fields;
};



OrgChart.server._getMostDeepChild = function (node) {
  if (!node) {
      return;
  }
  var mostDeep = node;
  function getMostDeepChild(n) {

      if (n.sl > mostDeep.sl) {
          mostDeep = n;
      }

      for (var i = 0; i < n.children.length; i++) {
          getMostDeepChild(n.children[i]);
      }
  }
  getMostDeepChild(node);

  return mostDeep;
};





OrgChart.server._getResponse = function (width, height, oldVisibleNodeIds, config, maxX, maxY, minX, minY, viewBox, roots, action, actionParams, nodes, oldNodes, vbIsInitializedFromState) {
  var firstRoot = roots[0];
  var visibleNodeIds = [];
  var boundary = {
      top: null,
      left: null,
      bottom: null,
      right: null,
      minX: null,
      maxX: null,
      minY: null,
      maxY: null
  };

  var animations = [[], [], []];

  var inX = maxX - minX + config.padding * 2;
  var inY = maxY - minY + config.padding * 2;

  var scale = OrgChart.getScale(viewBox, width, height, config.scaleInitial, config.scaleMax, config.scaleMin, inX, inY);

  boundary.top = minY - config.padding;
  boundary.left = minX - config.padding;
  boundary.bottom = maxY + config.padding - height / scale;
  boundary.right = maxX + config.padding - width / scale;
  boundary.maxX = maxX;
  boundary.minX = minX;
  boundary.maxY = maxY;
  boundary.minY = minY;



  if (roots.length == 0 || (viewBox == null && !vbIsInitializedFromState && config.align == OrgChart.CENTER)) { //initial load viewBox  is null
      var w = Math.ceil(width / scale);
      var h = Math.ceil(height / scale);
      var x = 0;
      var y = 0;

      if (w - config.padding * 2 >= maxX - minX) {//x is inside boundery areay
          x = (maxX + minX) / 2 - w / 2;
          switch (config.orientation) {
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  x = (minX - maxX) / 2 - w / 2;
                  break;
          }
      }
      else {//outside boundary area
          x = firstRoot.x - w / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
          switch (config.orientation) {
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  x = -((w / 2) - (minX - maxX) / 2);
                  if (x < config.padding - w) {
                      x = config.padding - w;
                  }
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.bottom_left:
              case OrgChart.orientation.top_left:
              case OrgChart.orientation.left_top:
                  x = -((w / 2) - (maxX - minX) / 2);
                  if (x > -config.padding) {
                      x = -config.padding
                  }
                  break;
          }
      }

      if (h - config.padding * 2 >= maxY - minY) {//y is inside boundery areay
          y = (maxY + minY) / 2 - h / 2;
          switch (config.orientation) {
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  y = (minY - maxY) / 2 - h / 2;
                  break;
          }
      }
      else {//outside boundary area

          y = -((h / 2) - (maxY - minY) / 2);

          if (y > -config.padding) {
              y = -config.padding;
          }
          switch (config.orientation) {
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  y = -((h / 2) - (minY - maxY) / 2);
                  if (y < config.padding - h) {
                      y = config.padding - h;
                  }
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.right:
                  y = firstRoot.y - h / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
                  break;
          }
      }

      viewBox = [x, y, w, h];
  }
  else if (viewBox == null && !vbIsInitializedFromState && config.align == OrgChart.ORIENTATION) {
      var w = Math.ceil(width / scale);
      var h = Math.ceil(height / scale);
      var x = 0;
      var y = 0;
      switch (config.orientation) {
          case OrgChart.orientation.top:
              x = firstRoot.x - w / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
              y = -config.padding;
              break;
          case OrgChart.orientation.bottom:
              x = firstRoot.x - w / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
              y = config.padding - h;
              break;
          case OrgChart.orientation.left:
              x = -config.padding;
              y = firstRoot.y - h / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
              break;
          case OrgChart.orientation.right:
              x = config.padding - w;
              y = firstRoot.y - h / 2 + OrgChart.server._getNodeWidth(firstRoot, config) / 2;
              break;
          case OrgChart.orientation.top_left:
              x = -config.padding;
              y = -config.padding;
              break;
          case OrgChart.orientation.right_top:
              x = config.padding - w;
              y = -config.padding;
              break;
          case OrgChart.orientation.left_top:
              x = -config.padding;
              y = -config.padding;
              break;
          case OrgChart.orientation.bottom_left:
              x = -config.padding;
              y = config.padding - h;
              break;
      }

      

      viewBox = [x, y, w, h];

      if (config.sticky) {
          //_moveToBoundaryArea start
          if (viewBox[0] < boundary.left && viewBox[0] < boundary.right) {
              viewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
          }
          if (viewBox[0] > boundary.right && viewBox[0] > boundary.left) {
              viewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
          }
          if (viewBox[1] < boundary.top && viewBox[1] < boundary.bottom) {
              viewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;
          }
          if (viewBox[1] > boundary.bottom && viewBox[1] > boundary.top) {
              viewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
          }
          //_moveToBoundaryArea end
      }

  }


  if (action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
      var centerNode = nodes[actionParams.id];
      if (actionParams.options.horizontal == true) {
          viewBox[0] = (centerNode.x + centerNode.w / 2 - viewBox[2] / 2);
      }
      if (actionParams.options.vertical == true) {
          viewBox[1] = (centerNode.y + centerNode.h / 2 - viewBox[3] / 2);
      }

      if (config.sticky) {
          //_moveToBoundaryArea start
          if (viewBox[0] < boundary.left && viewBox[0] < boundary.right) {
              viewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
          }
          if (viewBox[0] > boundary.right && viewBox[0] > boundary.left) {
              viewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
          }
          if (viewBox[1] < boundary.top && viewBox[1] < boundary.bottom) {
              viewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;
          }
          if (viewBox[1] > boundary.bottom && viewBox[1] > boundary.top) {
              viewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
          }
          //_moveToBoundaryArea end
      }
  }

  if (action == OrgChart.action.insert || action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.update || action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
      var shouldBeVisNode = null;
      if (action == OrgChart.action.insert && actionParams && actionParams.insertedNodeId != undefined && actionParams.insertedNodeId != null) {
          shouldBeVisNode = nodes[actionParams.insertedNodeId];
      }
      else if (action == OrgChart.action.update && actionParams && actionParams.visId != undefined && actionParams.visId != null) {
          shouldBeVisNode = nodes[actionParams.visId];
      }
      else if ((action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.maximize) && actionParams && actionParams.id != undefined && actionParams.id != null) {
          shouldBeVisNode = nodes[actionParams.id];
          shouldBeVisNode = OrgChart.server._getMostDeepChild(shouldBeVisNode, nodes);
      }
      else if (action == OrgChart.action.centerNode || action == OrgChart.action.maximize) {
          switch (config.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  if (!actionParams.options.vertical) {
                      shouldBeVisNode = nodes[actionParams.id];
                  }
                  break;
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  if (!actionParams.options.horizontal) {
                      shouldBeVisNode = nodes[actionParams.id];
                  }
                  break;
          }

          if (shouldBeVisNode) {
              shouldBeVisNode = OrgChart.server._getMostDeepChild(shouldBeVisNode, nodes);
          }
      }

      if (!OrgChart.FIXED_POSITION_ON_CLICK && shouldBeVisNode) {
          switch (config.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
                  var newX = (shouldBeVisNode.y + shouldBeVisNode.h - viewBox[3] + config.padding);
                  if (viewBox[1] < newX) {
                      viewBox[1] = newX;
                  }
                  break;
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  var newX = (shouldBeVisNode.y - config.padding);
                  if (viewBox[1] > newX) {
                      viewBox[1] = newX;
                  }
                  break;
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  var newX = (shouldBeVisNode.x - config.padding);
                  if (viewBox[0] > newX) {
                      viewBox[0] = newX;
                  }
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  var newX = (shouldBeVisNode.x + shouldBeVisNode.w - viewBox[2] + config.padding);
                  if (viewBox[0] < newX) {
                      viewBox[0] = newX;
                  }
                  break;
          }
      }
  }

  for (var i = 0; i < roots.length; i++) {
     OrgChart.server._iterate2(roots[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);
  }

  return {
      animations: animations,
      boundary: boundary,
      viewBox: viewBox,
      visibleNodeIds: visibleNodeIds,
      nodes: nodes,
      allFields: OrgChart.server.getAllFields(config)
  };
};


OrgChart.server._iterate2 = function (node, nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations) {   
  if (OrgChart.server._isVisible(node, config, viewBox, action)) {//childrean are expanded and in visible area    

      visibleNodeIds.push(node.id);
      var a = null;
      if ((action == OrgChart.action.expand || action == OrgChart.action.collapse || action == OrgChart.action.maximize) && oldNodes && oldNodes[node.id] && actionParams.method == 'expandCollapseToLevel') {
          var oldNode = oldNodes[node.id];
          a = {
              x: oldNode.x,
              y: oldNode.y,
          };

          if (oldNode) {
              a = {
                  x: oldNode.x,
                  y: oldNode.y,
              };

              var pnode = node;
              var fCollpased = null;
              while (pnode != null) {
                  if (oldNodes[pnode.id] && oldNodes[pnode.id].collapsed) {
                      fCollpased = pnode;
                  }
                  pnode = pnode.parent;
              }

              if (fCollpased && fCollpased.parent) {
                  a = {
                      x: fCollpased.parent.x,
                      y: fCollpased.parent.y,
                  };
              }
          }

          var clickedNode = nodes[actionParams.id];

          if (clickedNode) {
              var pnode = node.parent;
              while (pnode != null) {
                  pnode = pnode.parent;
              }
              if (pnode) {
                  a = {
                      x: clickedNode.x + clickedNode.w / 2 - node.w / 2,
                      y: clickedNode.y + clickedNode.h / 2 - node.h / 2
                  };
              }
          }
      }
      else if ((action == OrgChart.action.expand || action == OrgChart.action.collapse) && oldNodes && oldNodes[node.id]) {
          var oldNode = oldNodes[node.id];
          a = {
              x: oldNode.x,
              y: oldNode.y,
          };

          if (actionParams.ids == "all") {
              if (oldNode) {
                  a = {
                      x: oldNode.x,
                      y: oldNode.y,
                  };

                  var pnode = node;
                  var fCollpased = null;
                  while (pnode != null) {
                      if (oldNodes[pnode.id] && oldNodes[pnode.id].collapsed) {
                          fCollpased = pnode;
                      }
                      pnode = pnode.parent;
                  }

                  if (fCollpased && fCollpased.parent) {
                      a = {
                          x: fCollpased.parent.x,
                          y: fCollpased.parent.y,
                      };
                  }
              }
          }

          var clickedNode = nodes[actionParams.id];

          if (clickedNode) {
              var pnode = node.parent;
              while (pnode != null && actionParams.ids.indexOf(node.id) == -1 && actionParams.ids.indexOf(pnode.id) == -1) {
                  pnode = pnode.parent;
              }
              if (pnode) {
                  a = {
                      x: clickedNode.x + clickedNode.w / 2 - node.w / 2,
                      y: clickedNode.y + clickedNode.h / 2 - node.h / 2
                  };
              }
          }
      }
      else if (action == OrgChart.action.centerNode && oldNodes && oldNodes[node.id]) {
          var oldNode = oldNodes[node.id];
          if (oldNode.x != null && oldNode.y != null) {
              a = {
                  x: oldNode.x,
                  y: oldNode.y,
              };
          }

          var centerNode = nodes[actionParams.id];
          if (centerNode && centerNode == node) {
              var pnode = node.parent;
              if (pnode && pnode.id == actionParams.id) {
                  a = {
                      x: centerNode.x + centerNode.w / 2 - node.w / 2,
                      y: centerNode.y + centerNode.h / 2 - node.h / 2
                  };
              }
          }
      }
      else if (action == OrgChart.action.maximize && oldNodes && oldNodes[node.id]) {
          var oldNode = oldNodes[node.id];
          if (oldNode.x != null && oldNode.y != null) {
              a = {
                  x: oldNode.x,
                  y: oldNode.y,
              };
          }

          var centerNode = nodes[actionParams.id];
          if (centerNode && centerNode == node) {
              var pnode = node.parent;
              if (pnode && pnode.id == actionParams.id) {
                  a = {
                      x: centerNode.x + centerNode.w / 2 - node.w / 2,
                      y: centerNode.y + centerNode.h / 2 - node.h / 2
                  };
              }
          }
      }
      else if (action == OrgChart.action.minimize && oldNodes && oldNodes[node.id]) {
          var oldNode = oldNodes[node.id];
          a = {
              x: oldNode.x,
              y: oldNode.y,
          };
      }
      else if (action == OrgChart.action.insert && actionParams && actionParams.insertedNodeId == node.id && node.parent) {
          a = {
              x: node.parent.x,
              y: node.parent.y,
          };
      }
      else if ((action == OrgChart.action.update || action == OrgChart.action.insert) && oldNodes && oldNodes[node.id]) {
          var oldNode = oldNodes[node.id];
          a = {
              x: oldNode.x,
              y: oldNode.y,
          };
      }

      else if (action !== OrgChart.action.exporting && action !== OrgChart.action.init) {//animation from lazy loading   
          if (oldVisibleNodeIds.indexOf(node.id) == -1) {
              animations[0].push(node.id);
              animations[1].push({ opacity: 0 });
              animations[2].push({ opacity: 1 });
          }
      }

      if (a != null && a.x != null && a.y != null) { //#106
          if (a.x != node.x || a.y != node.y) {
              animations[0].push(node.id);
              animations[1].push({ transform: [1, 0, 0, 1, a.x, a.y] });
              animations[2].push({ transform: [1, 0, 0, 1, node.x, node.y] });
          }
      }
  }


  for (var i = 0; i < node.stChildren.length; i++) {
      OrgChart.server._iterate2(node.stChildren[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);    
  }

  for (var i = 0; i < node.children.length; i++) {
      OrgChart.server._iterate2(node.children[i], nodes, config, viewBox, action, actionParams, visibleNodeIds, oldNodes, oldVisibleNodeIds, animations);
  }
};




OrgChart.server._setMinMaxXYAdjustifyIterate = function(node, root, border, sl, bordersByRootIdAndLevel, adjust, orientation){
  switch (orientation) {
      case OrgChart.orientation.top:
      case OrgChart.orientation.top_left:
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          node.x += adjust.x;
          break;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
      case OrgChart.orientation.left:
      case OrgChart.orientation.left_top:
          node.y += adjust.y;
          break;
  }
  

  OrgChart._setMinMaxXY(node, border);

  for (var i = 0; i < node.stChildren.length; i++) {
      OrgChart.server._setMinMaxXYAdjustifyIterate(node.stChildren[i], node.stChildren[i], border, 0, bordersByRootIdAndLevel, adjust, orientation);
  }    

  if (node.isPartner){
      node.sl = sl - 1;
  }
  else{
      node.sl = sl;
  }

  if (bordersByRootIdAndLevel[root.id] == undefined){
      bordersByRootIdAndLevel[root.id] = {};
  }
  
  if (bordersByRootIdAndLevel[root.id][node.sl] == undefined){
      bordersByRootIdAndLevel[root.id][node.sl] = {
          minX: null,
          minY: null,
          maxX: null,
          maxY: null
      };
  }
  if (!node.layout){
      OrgChart._setMinMaxXY(node, bordersByRootIdAndLevel[root.id][node.sl]);
  }


  
  sl++;

  for (var i = 0; i < node.children.length; i++) {
      OrgChart.server._setMinMaxXYAdjustifyIterate(node.children[i], root, border, sl, bordersByRootIdAndLevel, adjust, orientation);
  }
}



OrgChart.server._doNotChangePositionOfClickedNodeIfAny = function (roots, nodes, action, actionParams, oldNodes, orientation) {
  if (action != OrgChart.action.expand && action != OrgChart.action.collapse && action != OrgChart.action.minimize && action != OrgChart.action.maximize && action != OrgChart.action.centerNode && action != OrgChart.action.update && action != OrgChart.action.insert) {
      return {
          x: 0,
          y: 0
      };
  }   

  if (action == OrgChart.action.update && (!actionParams || actionParams.id == undefined)) {
      if (!roots || !roots.length) {
          return {
              x: 0,
              y: 0
          };
      }
      actionParams = { id: roots[0].id };
  }

  if (actionParams.id == null) {//expand all
      return {
          x: 0,
          y: 0
      };
  }
  var id = actionParams.id;

  if (action == OrgChart.action.minimize && nodes[id].parent || action == OrgChart.action.maximize && nodes[id].parent) {
      id = nodes[id].pid;
  }

  var node = nodes[id];

  var oldNode = oldNodes[id];

  if (!oldNode) {
      return {
          x: 0,
          y: 0
      };
  }

  var adjust = {
      x: (oldNode.x ? oldNode.x : 0) - node.x,
      y: (oldNode.y ? oldNode.y : 0) - node.y
  };

  return adjust;
};
if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.templates = {};

//start base
OrgChart.templates.base = {
  defs: "",
  size: [250, 120],
  expandCollapseSize: 30,
  linkAdjuster: {
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
  },
  ripple: {
      radius: 0,
      color: "#e6e6e6",
      rect: null
  },
  assistanseLink: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}"/>',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>',
  link: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}"/>',
  pointer: '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#C1C1C1" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>',
  node: '<rect x="0" y="0" height="120" width="250" fill="none" stroke-width="1" stroke="#aeaeae"></rect>',
  plus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
  + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>'
  + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#aeaeae"></line>',
  minus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
  + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>',
  nodeMenuButton: '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>',
  exportMenuButton: '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" control-export-menu=""><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"></div>',
  img_0: '<clipPath id="{randId}"><circle cx="60" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="20"  width="80" height="80"></image>',
  link_field_0: '<text text-anchor="middle" fill="#aeaeae" width="290" x="0" y="0" style="font-size:10px;">{val}</text>'
};
//end base


//start ana
OrgChart.templates.ana = {
  defs: "",
  size: [250, 120],
  linkAdjuster: {
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
  },
  ripple: {
      radius: 0,
      color: "#e6e6e6",
      rect: null
  },
  expandCollapseSize: 30,
  svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>',
  link: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />',
  assistanseLink: '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}"/>',
  pointer: '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#C1C1C1" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>',
  node: '<rect x="0" y="0" height="{h}" width="{w}" fill="#039BE5" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>',
  plus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>'
      + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#aeaeae"></line>', 

  minus: '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
      + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>',
  nodeMenuButton: '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>',
  exportMenuButton: '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" control-export-menu=""><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"></div>',
  img_0: '<clipPath id="{randId}"><circle cx="50" cy="30" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-10"  width="80" height="80"></image>',
  link_field_0: '<text text-anchor="middle" fill="#aeaeae" width="290" x="0" y="0" style="font-size:10px;">{val}</text>',
  field_0: '<text width="230" style="font-size: 18px;" fill="#ffffff" x="125" y="95" text-anchor="middle">{val}</text>',
  field_1: '<text width="130" text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" x="230" y="30" text-anchor="end">{val}</text>',
  padding: [50, 20, 35, 20]
  //scaleLessThen: {
  //    "0.5": {
  //        field_0: '<text width="230" class="field_0" style="font-size: 24px;" fill="#ffffff" x="125" y="100" text-anchor="middle">{val}</text>',
  //        field_1: "",
  //        nodeMenuButton: ""
  //    },
  //    "0.3": {
  //        field_0: "",
  //        field_1: "",
  //        img_0: '<clipPath id="{randId}"><circle cx="70" cy="50" r="60"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-10"  width="120" height="120"></image>',
  //        nodeMenuButton: ""
  //    }
  //}
};
//end ana


OrgChart.templates.split = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.split.size = [10, 10];
OrgChart.templates.split.node = '<circle cx="5" cy="5" r="5" fill="none" stroke-width="1" stroke="#aeaeae"></circle>';



//start sub tree
OrgChart.templates.group = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.group.size = [250, 120];
OrgChart.templates.group.node = '<rect rx="50" ry="50" x="0" y="0" height="{h}" width="{w}" fill="#f2f2f2" stroke-width="0"></rect>';
OrgChart.templates.group.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';
OrgChart.templates.group.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,{ew},25)" control-node-menu-id="{id}"><g transform="matrix(1,0,0,1,-22,-8)"><rect x="0" y="0" fill="red" fill-opacity="0" width="18" height="22"></rect><line x1="0" y1="2" x2="9" y2="2" stroke="#aeaeae" stroke-width="1"></line><line x1="0" y1="9" x2="18" y2="9" stroke="#aeaeae" stroke-width="1"></line><line x1="0" y1="16" x2="22" y2="16" stroke="#aeaeae" stroke-width="1"></line></g></g>';
OrgChart.templates.group.field_0 = '<text width="230" style="font-size: 18px;" fill="#aeaeae" x="{cw}" y="30" text-anchor="middle">{val}</text>';
OrgChart.templates.group.field_1 = '';

OrgChart.templates.group.ripple = {
  radius: 50,
  color: "#aeaeae"
};

OrgChart.templates.invisibleGroup = Object.assign({}, OrgChart.templates.group);
OrgChart.templates.invisibleGroup.node = "";
OrgChart.templates.invisibleGroup.padding = [0,0,0,0];
OrgChart.templates.invisibleGroup.field_0 = '';
OrgChart.templates.invisibleGroup.nodeMenuButton = "";
//end sub tree

OrgChart.templates.mirror = {
  linkAdjuster: {},
  link: "",
  node: "",
  nodeMenuButton: "",
  size: [0, 0]
};


//start ula
OrgChart.templates.ula = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.ula.field_0 = '<text width="145" style="font-size: 18px;" fill="#039BE5" x="100" y="55">{val}</text>';
OrgChart.templates.ula.field_1 = '<text width="145" text-overflow="multiline" style="font-size: 14px;" fill="#afafaf" x="100" y="76">{val}</text>';
OrgChart.templates.ula.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#039BE5"></line>';
OrgChart.templates.ula.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="20" width="80" height="80" ></image>';
OrgChart.templates.ula.menu = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,12)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#ffffff" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#039BE5"></circle><circle cx="7" cy="0" r="2" fill="#039BE5"></circle><circle cx="14" cy="0" r="2" fill="#039BE5"></circle></g>';
OrgChart.templates.ula.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="7" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="14" cy="0" r="2" fill="#AEAEAE"></circle></g>';
//end ula

//start olivia
OrgChart.templates.olivia = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.olivia.field_0 = '<text width="145" style="font-size: 18px;" fill="#757575" x="100" y="55">{val}</text>';
OrgChart.templates.olivia.field_1 = '<text width="145" style="font-size: 14px;" fill="#757575" x="100" y="76">{val}</text>';
OrgChart.templates.olivia.defs = '<linearGradient id="{randId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#fff;stop-opacity:1" /><stop offset="100%" style="stop-color:#eee;stop-opacity:1" /></linearGradient>';
OrgChart.templates.olivia.node = '<rect fill="url(#{randId})" x="0" y="0" height="{h}" width="{w}" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>';
OrgChart.templates.olivia.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="60" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="20" width="80" height="80" ></image>';
OrgChart.templates.olivia.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="7" cy="0" r="2" fill="#AEAEAE"></circle><circle cx="14" cy="0" r="2" fill="#AEAEAE"></circle></g>';

//end olivia



//start belinda
OrgChart.templates.belinda = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.belinda.size = [180, 180];
OrgChart.templates.belinda.ripple = {
  radius: 90,
  color: "#e6e6e6",
  rect: null
};

OrgChart.templates.belinda.node = '<circle cx="90" cy="90" r="90" fill="#039BE5" stroke-width="1" stroke="#aeaeae"></circle>';
OrgChart.templates.belinda.img_0 = '<clipPath id="{randId}"><circle cx="90" cy="45" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="50" y="5" width="80" height="80" ></image>';
OrgChart.templates.belinda.field_0 = '<text width="170" style="font-size: 18px;" text-anchor="middle" fill="#ffffff"  x="90" y="105">{val}</text>';
OrgChart.templates.belinda.field_1 = '<text width="160" style="font-size: 14px;" text-anchor="middle" fill="#ffffff"  x="90" y="125">{val}</text>';
OrgChart.templates.belinda.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';
OrgChart.templates.belinda.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,79,5)" control-node-menu-id="{id}"><rect x="0" y="0" fill="#000000" fill-opacity="0" width="22" height="22"></rect>'
  + '<line stroke-width="2" stroke="#000" x1="0" y1="3" x2="22" y2="3"></line>'
  + '<line stroke-width="2" stroke="#000" x1="0" y1="9" x2="22" y2="9"></line>'
  + '<line stroke-width="2" stroke="#000" x1="0" y1="15" x2="22" y2="15"></line>'
  + '</g>';

//end belinda

//start rony
OrgChart.templates.rony = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.rony.svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color:#E8E8E8;display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>';
OrgChart.templates.rony.defs = '<filter id="{randId}" x="0" y="0" width="200%" height="200%"><feOffset result="offOut" in="SourceAlpha" dx="5" dy="5"></feOffset><feGaussianBlur result="blurOut" in="offOut" stdDeviation="5"></feGaussianBlur><feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend></filter>';
OrgChart.templates.rony.size = [180, 250];
OrgChart.templates.rony.ripple = {
  color: "#F57C00",
  radius: 5,
  rect: null
};
OrgChart.templates.rony.img_0 = '<clipPath id="{randId}"><circle cx="90" cy="160" r="60"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="30" y="100"  width="120" height="120"></image>';
OrgChart.templates.rony.node = '<rect filter="url(#{randId})" x="0" y="0" height="250" width="180" fill="#ffffff" stroke-width="0" rx="5" ry="5"></rect>';
OrgChart.templates.rony.field_0 = '<text width="165" style="font-size: 18px;" fill="#039BE5" x="90" y="40" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.field_1 = '<text width="165" style="font-size: 14px;" fill="#F57C00" x="90" y="60" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.field_2 = '<text width="165" style="font-size: 14px;" fill="#FFCA28" x="90" y="80" text-anchor="middle">{val}</text>';
OrgChart.templates.rony.link = '<path stroke="#039BE5" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}"/>';
OrgChart.templates.rony.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle>'
  + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line>'
  + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#039BE5"></line>';

OrgChart.templates.rony.minus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle>'
  + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line>';
OrgChart.templates.rony.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,155,235)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#F57C00"></circle><circle cx="7" cy="0" r="2" fill="#F57C00"></circle><circle cx="14" cy="0" r="2" fill="#F57C00"></circle></g>';
//end rony

//start mery
OrgChart.templates.mery = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.mery.ripple = {
  color: "#e6e6e6",
  radius: 50,
  rect: null
};
OrgChart.templates.mery.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#686868" rx="50" ry="50"></rect><rect x="0" y="45" height="30" width="250" fill="#039BE5" stroke-width="1"></rect>';
OrgChart.templates.mery.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';
OrgChart.templates.mery.img_0 = '<clipPath id="{randId}"><circle cx="125" cy="60" r="24"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="95" y="33"  width="60" height="60"></image>';
OrgChart.templates.mery.field_0 = '<text width="220" style="font-size: 18px;" fill="#039BE5" x="125" y="30" text-anchor="middle">{val}</text>';
OrgChart.templates.mery.field_1 = '<text width="220" style="font-size: 14px;" fill="#039BE5" x="125" y="100" text-anchor="middle">{val}</text>';
OrgChart.templates.mery.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,60)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end mery

//start polina
OrgChart.templates.polina = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.polina.size = [300, 80];
OrgChart.templates.polina.ripple = {
  color: "#e6e6e6",
  radius: 40,
  rect: null
};
OrgChart.templates.polina.node = '<rect x="0" y="0" height="80" width="300" fill="#039BE5" stroke-width="1" stroke="#686868" rx="40" ry="40"></rect>';
OrgChart.templates.polina.img_0 = '<clipPath id="{randId}"><circle  cx="40" cy="40" r="35"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="0" y="0"  width="80" height="80"></image>';
OrgChart.templates.polina.field_0 = '<text width="210" style="font-size: 18px;" fill="#ffffff" x="80" y="30" text-anchor="start">{val}</text>';
OrgChart.templates.polina.field_1 = '<text width="210" style="font-size: 14px;" fill="#ffffff" x="80" y="55" text-anchor="start">{val}</text>';
OrgChart.templates.polina.link = '<path stroke="#686868" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';
OrgChart.templates.polina.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,285,33)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="0" cy="7" r="2" fill="#ffffff"></circle><circle cx="0" cy="14" r="2" fill="#ffffff"></circle></g>';
//end polina

//start mila
OrgChart.templates.mila = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.mila.node = '<rect x="0" y="0" height="120" width="250" fill="#039BE5" stroke-width="1" stroke="#aeaeae"></rect><rect x="-5" y="70" height="30" width="260" fill="#ffffff" stroke-width="1" stroke="#039BE5"></rect><line x1="-5" x2="0" y1="100" y2="105" stroke-width="1" stroke="#039BE5"/><line x1="255" x2="250" y1="100" y2="105" stroke-width="1" stroke="#039BE5"/>';
OrgChart.templates.mila.img_0 = '<image preserveAspectRatio="xMidYMid slice" xlink:href="{val}" x="20" y="5"  width="64" height="64"></image>';
OrgChart.templates.mila.field_0 = '<text width="240" style="font-size: 18px;" fill="#039BE5" x="125" y="92" text-anchor="middle">{val}</text>';
OrgChart.templates.mila.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,110)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end mila

//start diva
OrgChart.templates.diva = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.diva.size = [200, 170];
OrgChart.templates.diva.node = '<rect x="0" y="80" height="90" width="200" fill="#039BE5"></rect><circle cx="100" cy="50" fill="#ffffff" r="50" stroke="#039BE5" stroke-width="2"></circle>';
OrgChart.templates.diva.img_0 = '<clipPath id="{randId}"><circle cx="100" cy="50" r="45"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="50" y="0"  width="100" height="100"></image>';
OrgChart.templates.diva.field_0 = '<text width="185" style="font-size: 18px;" fill="#ffffff" x="100" y="125" text-anchor="middle">{val}</text>';
OrgChart.templates.diva.field_1 = '<text width="185" style="font-size: 14px;" fill="#ffffff" x="100" y="145" text-anchor="middle">{val}</text>';
OrgChart.templates.diva.pointer = '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#039BE5" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>';
OrgChart.templates.diva.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,175,155)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end diva

//start luba
OrgChart.templates.luba = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.luba.svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:block;background-color: #2E2E2E;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>';
OrgChart.templates.luba.defs = '<linearGradient id="{randId}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#646464;stop-opacity:1" /><stop offset="100%" style="stop-color:#363636;stop-opacity:1" /></linearGradient>';
OrgChart.templates.luba.node = '<rect fill="url(#{randId})" x="0" y="0" height="120" width="250" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>';
OrgChart.templates.luba.img_0 = '<clipPath id="{randId}"><circle cx="50" cy="25" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="-15"  width="80" height="80"></image>';
OrgChart.templates.luba.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,105)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#aeaeae"></circle><circle cx="7" cy="0" r="2" fill="#aeaeae"></circle><circle cx="14" cy="0" r="2" fill="#aeaeae"></circle></g>';
OrgChart.templates.luba.field_0 = '<text width="235" style="font-size: 18px;" fill="#aeaeae" x="125" y="90" text-anchor="middle">{val}</text>';
OrgChart.templates.luba.field_1 = '<text width="140" style="font-size: 14px;" fill="#aeaeae" x="240" y="30" text-anchor="end">{val}</text>';
OrgChart.templates.luba.plus = '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
  + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>'
  + '<line x1="18" y1="4" x2="18" y2="32" stroke-width="1" stroke="#aeaeae"></line>';

OrgChart.templates.luba.minus = '<rect x="0" y="0" width="36" height="36" rx="12" ry="12" fill="#2E2E2E" stroke="#aeaeae" stroke-width="1"></rect>'
  + '<line x1="4" y1="18" x2="32" y2="18" stroke-width="1" stroke="#aeaeae"></line>';

OrgChart.templates.luba.expandCollapseSize = 36;
//end luba




//start derek
OrgChart.templates.derek = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.derek.link = '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}"/>';
OrgChart.templates.derek.field_0 = '<text width="235" style="font-size: 24px;" fill="#aeaeae" x="125" y="90" text-anchor="middle">{val}</text>';
OrgChart.templates.derek.field_1 = '<text width="130" style="font-size: 16px;" fill="#aeaeae" x="230" y="30" text-anchor="end">{val}</text>';
OrgChart.templates.derek.node = '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="0" stroke="none" rx="5" ry="5"></rect><path d="M1.0464172536455116 0.43190469224125483 C53.84241668202045 -0.788936709486018, 103.41786516460891 -0.7020837047025514, 252.36637077877316 2.5880308844586395 M2.9051048929845287 1.416953777798454 C94.33574460557007 1.0012759229446266, 189.39715875173388 0.6456731199982935, 252.78978918302985 2.4201778360648074 M253.62699063660838 2.9193391477217157 C249.73034548542307 47.55931231380586, 252.87525930998083 91.26715478378368, 253.10179184315842 121.7440626272514 M251.37132919216776 1.8733470844542213 C252.2809675089866 32.73212950193807, 251.34402714677282 62.11470833534073, 251.87050951184997 121.58550827952904 M253.33945599552268 122.05611967964798 C171.36076589155192 123.47737863766969, 88.83808249906167 125.27259840604118, 3.1999393565128846 121.26868651191393 M252.26165120810887 122.5938901158243 C192.76996487394138 123.44664377223289, 131.37122563794998 122.94880221756583, 1.2373006891045732 121.88999197324904 M2.223863211672736 121.04511533445009 C1.4438124377596486 86.38398979211773, 2.8540468486809294 55.805566409478374, 3.8890451480896644 1.7483404843613926 M2.244347335490432 122.60147677858153 C2.100672267495622 92.31058899219087, 1.6261027388218166 64.160806803772, 1.6325734600065367 1.1945909353588222" stroke="#aeaeae" ></path>'
OrgChart.templates.derek.defs = ' <filter id="grayscale"><feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"/></filter>';
OrgChart.templates.derek.img_0 = '<clipPath id="{randId}"><circle cx="60" cy="30" r="36"></circle></clipPath><path d="M59.27394950148486 -8.301766751084706 C67.69473471187919 -8.865443566034696, 80.29031463018414 -4.859224005049532, 87.18598909426663 0.33238763875740673 C94.08166355834912 5.523999282564345, 98.98110545022442 14.745947814116153, 100.64799628597981 22.847903111756924 C102.31488712173521 30.949858409397695, 101.71467046207992 41.576461864335656, 97.187334108799 48.944119424602036 C92.65999775551809 56.311776984868416, 82.03610997730354 64.08326918912249, 73.48397816629435 67.05384847335519 C64.93184635528516 70.02442775758789, 54.01035575000908 69.7708463163516, 45.874543242743854 66.76759512999827 C37.738730735478626 63.76434394364495, 29.04872278114092 56.18846598822666, 24.669103122702957 49.034341355235284 C20.289483464264993 41.88021672224391, 18.158053754175985 31.830144088547545, 19.596825292116065 23.84284733205002 C21.035596830056146 15.855550575552495, 25.795252700735308 6.49424361294595, 33.30173235034344 1.1105608162501355 C40.80821199995158 -4.273121980445679, 58.92971347412665 -7.0427741956040295, 64.63570318976488 -8.459249448124865 C70.34169290540312 -9.8757247006457, 67.62192977382313 -7.857597534262704, 67.53767064417285 -7.388290698874876 M62.748378255307365 -8.335850348284236 C71.26603403676657 -8.411982637093757, 83.3134559967999 -3.2332675886967737, 89.65944437868365 2.387927626929269 C96.00543276056739 8.00912284255531, 99.8018539626104 17.389209313563462, 100.82430854660979 25.39132094547202 C101.84676313060918 33.39343257738058, 100.69202080288338 43.23907526327184, 95.79417188267999 50.40059741838061 C90.8963229624766 57.56211957348938, 80.19607375493683 65.6933432424228, 71.43721502538948 68.36045387612462 C62.678356295842114 71.02756450982645, 51.31858275833087 70.03148525422704, 43.241019505395826 66.40326122059156 C35.16345625246078 62.775037186956084, 26.840434236544123 54.120081952867466, 22.971835507779204 46.59110967431175 C19.103236779014285 39.06213739575604, 17.94937086132579 28.992694575765086, 20.029427132806305 21.22942754925726 C22.10948340428682 13.466160522749433, 28.239699334668693 5.033316212766326, 35.452173136662296 0.011507515264803203 C42.6646469386559 -5.010301182236719, 59.029629541347575 -7.774813789367088, 63.30426994476793 -8.901424635751876 C67.57891034818829 -10.028035482136666, 61.20261013623477 -7.6019933587127815, 61.10001555718443 -6.748157563043929" style="stroke: #aeaeae; stroke-width: 2; fill: none;"></path><image filter="url(#grayscale)" preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="-10"  width="80" height="80"></image>';
OrgChart.templates.derek.minus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke-width="0"></circle><path d="M17.23891044927774 1.1814294501322902 C20.29160626452551 1.030769196657948, 23.947970993006972 3.1719335544839753, 26.394853759110717 5.588671983418923 C28.84173652521446 8.005410412353871, 31.246576051221126 12.511831935158815, 31.920207045900206 15.681860023741976 C32.593838040579286 18.85188811232514, 32.286699675240925 21.948848714186923, 30.436639727185195 24.60884051491789 C28.586579779129462 27.268832315648858, 24.05246578668338 30.675892912089505, 20.819847357565806 31.64181082812777 C17.58722892844823 32.60772874416604, 13.992479948405318 31.588687222722193, 11.040929152479746 30.404348011147484 C8.089378356554175 29.220008799572774, 4.476346434761303 27.363985211380037, 3.110542582012373 24.535775558679525 C1.7447387292634435 21.707565905979013, 2.0125141957866703 16.770753327135857, 2.8461060359861694 13.435090094944405 C3.6796978761856685 10.099426862752953, 4.99838568665378 6.33816589513267, 8.112093623209367 4.521796165530812 C11.225801559764953 2.7054264359289544, 18.764666760207586 2.8505106971937155, 21.528353655319687 2.5368717173332556 C24.29204055043179 2.2232327374727956, 24.87088035867136 2.534909813412478, 24.69421499388197 2.6399622863680516 M17.281640595209783 0.19007885243722633 C20.364244435145494 -0.11577004716725742, 25.135133405402318 3.2303746945812075, 27.855952721223584 5.7353294427454955 C30.57677203704485 8.240284190909783, 33.34617538156587 11.802005102645245, 33.606556490137386 15.219807341422953 C33.8669375987089 18.637609580200664, 31.337125602828454 23.632355493641384, 29.418239372652685 26.24214287541175 C27.499353142476917 28.85193025718212, 25.044077583504755 30.13224182494988, 22.093239109082777 30.87853163204516 C19.1424006346608 31.62482143914044, 14.787723024669972 31.933646092018286, 11.713208526120809 30.719881717983426 C8.638694027571646 29.506117343948567, 5.1333408130933655 26.55826769548724, 3.6461521177877945 23.595945387835997 C2.1589634224822234 20.633623080184755, 1.9785010696309286 16.25773192692332, 2.7900763542873843 12.945947872075987 C3.60165163894384 9.634163817228652, 5.999109831161897 5.87039683716568, 8.51560382572653 3.7252410587519886 C11.032097820291161 1.5800852803382974, 16.377503419445155 0.40900388408914673, 17.88904032167518 0.0750132015938405 C19.400577223905202 -0.2589774809014657, 17.448582822593046 1.2406055078364167, 17.584825239106664 1.7212969637801514" style="stroke: rgb(174, 174, 174); stroke-width: 1; fill: none;"></path><path d="M8.571186416504453 17.64803469305822 C12.085276840999553 15.452815349785006, 19.337130848197884 16.101685575250833, 26.855223350440756 18.889299472836626 M7.857231507904164 16.840024354210055 C15.011849298914942 18.06824852479784, 22.352469730756894 17.800410681835732, 26.732355140012178 16.88515873797708" style="stroke: #aeaeae; stroke-width: 1; fill: none;"></path>';
OrgChart.templates.derek.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke-width="0"></circle><path d="M12.257463787262992 2.40166003616363 C15.548960627027807 1.1768586505919105, 20.323768339136134 1.874732142276981, 23.661947633240565 3.0864861053786417 C27.000126927344997 4.298240068480302, 30.703811226452725 6.729324000523814, 32.286539551889575 9.672183814773595 C33.86926787732643 12.615043629023376, 33.788018167397944 17.557781915741554, 33.158317585861674 20.743644990877332 C32.528617004325405 23.92950806601311, 31.137543762406274 26.899980401737224, 28.508336062671955 28.787362265588257 C25.879128362937635 30.67474412943929, 21.064677192956335 31.99302804642975, 17.383071387455747 32.06793617398354 C13.701465581955157 32.14284430153733, 9.342085269075854 31.17242931287016, 6.418701229668416 29.236811030911003 C3.4953171902609785 27.301192748951845, 0.29124975331190645 23.792422306170057, -0.15723284898887968 20.454226482228595 C-0.6057154512896659 17.116030658287134, 1.5769138742615705 12.178626667602387, 3.7278056158636996 9.207636087262241 C5.878697357465828 6.236645506922095, 10.970632450860041 3.8471017540469195, 12.748117600623896 2.6282830001877198 C14.525602750387751 1.4094642463285199, 14.289563699001825 1.9470094191022314, 14.392716514446832 1.894723564107041 M22.43549828180672 1.2256088400576157 C25.69018250895055 1.7704365119039576, 29.24546322166512 4.979269460398017, 31.051492912414023 8.188373611713667 C32.85752260316293 11.397477763029316, 33.67207918890526 17.17514768034262, 33.27167642630015 20.480233747951512 C32.871273663695035 23.785319815560406, 31.41050911947538 25.966765564166938, 28.649076336783356 28.01889001736704 C25.887643554091333 30.07101447056714, 20.094058835586818 32.38500719321419, 16.70307973014802 32.79298046715211 C13.31210062470922 33.20095374109003, 10.940906263905317 32.367748192606626, 8.303201704150565 30.46672966099454 C5.665497144395813 28.565711129382457, 2.097338248187536 24.641108687248686, 0.8768523716195098 21.386869277479594 C-0.34363350494851663 18.132629867710502, -0.763694313917872 14.0433435213021, 0.980286444742406 10.941293202379995 C2.7242672034026842 7.83924288345789, 7.945090366802328 4.317959037402062, 11.340736923581177 2.774567363946959 C14.736383480360027 1.231175690491856, 19.39979547907987 1.5862021443476335, 21.354165785415507 1.6809431616493775 C23.308536091751144 1.7756841789511215, 22.887857886273373 3.132249638930103, 23.06695876159499 3.343013467757423" style="stroke: rgb(174, 174, 174); stroke-width: 1; fill: none;"></path><path d="M7.0048103933165935 18.109075284628886 C12.152504846776358 18.486044066779655, 15.926735549928488 18.85477711845977, 26.641287664541796 15.553207106118496 M6.796084928139555 16.174781745374535 C14.085050058006614 16.53898319893461, 19.579209483395115 16.725914747038104, 27.441803598385356 17.277875712554966" style="stroke: #aeaeae; stroke-width: 1; fill: none;"></path><path d="M16.293755471804 6.234638030793387 C17.448668211406996 11.453666045700338, 16.27043554943843 18.842895411477887, 16.90423703847114 28.952046969222806 M17.809777051185264 7.011866752183222 C17.599122858612276 13.07833796918755, 16.995204905243295 18.587342115968614, 17.888568853882067 26.844926419317094" style="stroke: #aeaeae; stroke-width: 1; fill: none;"></path>';
OrgChart.templates.derek.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,210,80)" control-node-menu-id="{id}"><rect x="-4" y="-4" fill="#000000" fill-opacity="0" width="30" height="30"></rect>'
  + '<path d="M28.28024041166867 10.015533059199505 C16.45705393905741 10.81309700412131, 9.85276157405196 9.87162723980281, 3.5441213169168515 7.075531655648353 M27.551825308513525 8.923800642512257 C18.159502224784205 9.337153563754718, 7.451197502628936 9.284728719203128, 1.8548423867425456 8.753004894810802 M27.907104120536573 17.662200828300364 C18.343063985797404 18.998694042201137, 6.69417200021006 18.568117962359516, 2.7668346274558218 17.84920936843539 M26.99365966559525 17.444217688828093 C18.288291344549645 16.258053076066645, 10.047008592341617 16.913684103209345, 2.1772395910449567 17.55258716848472 M25.754130110044443 24.79648729629354 C19.716463597004157 24.059273917380096, 12.571903015673474 24.723484329803995, 1.2709092686545498 25.961416660790483 M26.031268385778997 24.853114475295413 C16.16958752624931 25.047162545233455, 7.4039608372111765 23.9169859615211, 1.4736400026930716 24.342985647697336" style="stroke: rgb(174, 174, 174); stroke-width: 1; fill: none;"></path>'
  + '</g>';

//end derek

//start isla

OrgChart.templates.isla = Object.assign({}, OrgChart.templates.ana);
OrgChart.templates.isla.defs = '<filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="isla-shadow"><feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';
OrgChart.templates.isla.size = [180, 120];
OrgChart.templates.isla.node = '<rect filter="url(#isla-shadow)" x="0" y="20" rx="5" ry="5" height="100" width="180" fill="#FFF" stroke-width="1" stroke="#039BE5" ></rect><rect x="25" y="75" rx="10" ry="10" height="20" width="130" fill="#039BE5" stroke-width="3" stroke="#039BE5"></rect><rect fill="#ffffff" stroke="#039BE5" stroke-width="1" x="70" y="0" rx="13" ry="13" width="40" height="40"></rect><circle stroke="#FFCA28" stroke-width="3" fill="none" cx="90" cy="12" r="8"></circle><path d="M75,34 C75,17 105,17 105,34" stroke="#FFCA28" stroke-width="3" fill="none"></path>';
OrgChart.templates.isla.field_0 = '<text width="120" style="font-size: 12px;" fill="#fff" x="90" y="90" text-anchor="middle">{val}</text>';
OrgChart.templates.isla.field_1 = '<text width="160" style="font-size: 13px;" fill="#039BE5" x="90" y="64" text-anchor="middle">{val}</text>';
OrgChart.templates.isla.img_0 = '<clipPath id="{randId}"><rect filter="url(#isla-shadow)" fill="#ffffff" stroke="#039BE5" stroke-width="1" x="70" y="0" rx="13" ry="13" width="40" height="40"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="70" y="0"  width="40" height="40"></image>';
OrgChart.templates.isla.minus = '<circle cx="15" cy="15" r="15" fill="#F57C00" stroke="#F57C00" stroke-width="1"></circle><line x1="8" y1="15" x2="22" y2="15" stroke-width="1" stroke="#ffffff"></line>';
OrgChart.templates.isla.plus = '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#039BE5" stroke-width="1"></circle><line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#039BE5"></line><line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#039BE5"></line>';
OrgChart.templates.isla.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,83,45)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#F57C00"></circle><circle cx="7" cy="0" r="2" fill="#F57C00"></circle><circle cx="14" cy="0" r="2" fill="#F57C00"></circle></g>';

OrgChart.templates.isla.ripple = {
  radius: 0,
  color: "#F57C00",
  rect: { x: 0, y: 20, width: 180, height: 100 }
};
//end isla


//start deborah
OrgChart.templates.deborah = Object.assign({}, OrgChart.templates.polina);
 
OrgChart.templates.deborah.size = [150, 150];
OrgChart.templates.deborah.node = 
  '<rect x="0" y="0" height="150" width="150" fill="#039BE5" stroke-width="1" stroke="#686868" rx="15" ry="15"></rect>';

OrgChart.templates.deborah.img_0 = 
  '<clipPath id="{randId}"><rect fill="#ffffff" stroke="#039BE5" stroke-width="1" x="5" y="5" rx="15" ry="15" width="140" height="140"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="5" y="5"  width="140" height="140"></image><rect x="3" y="5" height="30" width="144" fill="#039BE5" opacity="0.5" rx="3" ry="3"></rect><rect x="3" y="115" height="30" width="144" fill="#039BE5" opacity="0.5" rx="3" ry="3"></rect>';
 
OrgChart.templates.deborah.field_0 = '<text width="125" text-overflow="ellipsis" style="font-size: 18px;" fill="#ffffff" x="15" y="25" text-anchor="start">{val}</text>';
OrgChart.templates.deborah.field_1 = '<text width="105" text-overflow="ellipsis" style="font-size: 11px;" fill="#ffffff" x="15" y="135" text-anchor="start">{val}</text>';

OrgChart.templates.deborah.nodeMenuButton = 
  '<g style="cursor:pointer;" transform="matrix(1,0,0,1,125,130)" control-node-menu-id="{id}"><rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect><circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';
//end deborah    



//start subLevel    
OrgChart.templates.subLevel = Object.assign({}, OrgChart.templates.base);
OrgChart.templates.subLevel.size = [0, 0];
OrgChart.templates.subLevel.node = '';
OrgChart.templates.subLevel.plus = '';
OrgChart.templates.subLevel.minus = '';
OrgChart.templates.subLevel.nodeMenuButton = '';
//end subLevel


OrgChart.ui = {
  _defsIds: {},
  defs: function (fromrender) {
      var defs = "";
      for (var templateNeme in OrgChart.templates) {
          var template = OrgChart.templates[templateNeme];
          if (template.defs) {
              OrgChart.ui._defsIds[templateNeme] = OrgChart.randomId();
              defs += template.defs.replace("{randId}", OrgChart.ui._defsIds[templateNeme]);
          }
          else {
              defs += template.defs;
          }
      }

      return '<defs>' + defs + fromrender +'</defs>';
  },

  css: function () {
      var css = '.bg-ripple-container {position: absolute; top: 0; right: 0; bottom: 0; left: 0; }'
          + ' .bg-ripple-container span {transform: scale(0);border-radius:100%;position:absolute;opacity:0.75;background-color:#fff;animation: bg-ripple 1000ms; }'
          + '@-moz-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@-webkit-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@-o-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}'
          + '.bg-switch {position:relative;display:inline-block;width:60px;height:24px;float:right;}'
          + '.bg-switch input {opacity:0;width:0;height:0;}'
          + '.bg-slider {position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color: #ccc;-webkit-transition:.4s;transition: .4s;}'
          + '.bg-slider:before {position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;-webkit-transition:.4s;transition:.4s;}'
          + 'input:checked + .bg-slider {background-color:#2196F3;}'
          + 'input:focus + .bg-slider {box-shadow:0 0 1px #2196F3;}'
          + 'input:checked + .bg-slider:before {-webkit-transform:translateX(34px);-ms-transform:translateX(34px);transform:translateX(34px);}'
          + '.bg-slider.round {border-radius:24px;}'
          + '.bg-slider.round:before {border-radius:50%;}'
          + 'svg text:hover {cursor:default;}'
          + 'svg.cursor-grab, svg.cursor-grab text:hover {cursor:grab;}'
          + 'svg.cursor-nodrop, svg.cursor-nodrop text:hover {cursor:no-drop;}'
          + 'svg.cursor-copy, svg.cursor-copy text:hover {cursor:copy;}'
          + 'svg.cursor-move, svg.cursor-move text:hover  {cursor:move;}'
          + '#close-btn:hover, #close-btn:focus {color: #000; text-decoration: none; cursor: pointer;} #id-select:focus, #pid-select:focus {outline: 0.5px solid #aeaeae;} #sampleDialog #title:hover{ cursor:default; background:gray;}';

      return '<style>' + css + '</style>';
  },

  lonely: function (config) {
      if (!config.nodes || !config.nodes.length) {
          return OrgChart.IT_IS_LONELY_HERE
              .replace("{link}", OrgChart.RES.IT_IS_LONELY_HERE_LINK);
      }
      else {
          return "";
      }
  },

  pointer: function (config, action, scale) {
      if (action === OrgChart.action.exporting) {
          return "";
      }
      var t = OrgChart.t(config.template, false, scale);
      return t.pointer;
  },

  node: function (node, data, animations, config, x, y, nodeBinding, action, scale, sender) {
      var t = OrgChart.t(node.templateName, node.min, scale);
    
      var nodeHtml = t.node
          .replaceAll("{w}", node.w)
          .replaceAll("{h}", node.h);   



      if (t.defs) {
          nodeHtml = nodeHtml.replace("{randId}", OrgChart.ui._defsIds[node.templateName]);
      }

      if (nodeBinding == undefined) {
          nodeBinding = config.nodeBinding;
      }

      for (var f in nodeBinding) {
          var val = nodeBinding[f];
          if (data) {
              var replacement = data[val];
              if (typeof (val) == "function") {
                  replacement = val(sender, node, data);
              }
              if (replacement != undefined && replacement != null && t[f] != undefined) {
                  var fieldHtml;
                  if (!OrgChart._lblIsImg(config, f) && typeof (replacement) == "string") {

                      replacement = OrgChart.wrapText(replacement, t[f]);
                      fieldHtml = t[f].replace("{val}", replacement);
                  }
                  else {
                      fieldHtml = t[f].replace("{val}", replacement);
                  }
                  fieldHtml = fieldHtml
                      .replaceAll("{ew}", node.w - (node.padding ? node.padding[1] : 0))
                      .replaceAll("{cw}", node.w / 2)
                      .replaceAll("{randId}", OrgChart.randomId())
                      .replaceAll("{randId2}", OrgChart.randomId());
                  nodeHtml += fieldHtml;
              }
          }
      }


      var pos = OrgChart._getPosition(animations, node, x, y);

      var selectors = "node";
      if (Array.isArray(node.tags) && node.tags.length) {
          selectors += " " + node.tags.join(" ");
      }
      if (node.layout) {
          selectors += " tree-layout";
      }

      var lcn = "";
      if (node.lcn){
          lcn = 'lcn="' + node.lcn + '"'
      }
      
      var openTag = OrgChart.nodeOpenTag
          .replace("{lcn}", lcn)
          .replace("{id}", node.id)
          .replace("{class}", selectors)
          .replace("{sl}", node.sl)
          .replace("{level}", node.level)
          .replace("{x}", pos.x)
          .replace("{y}", pos.y);



      var opacity = OrgChart._getOpacity(animations, node);
      openTag = openTag.replace("{opacity}", opacity);

      if ((config.nodeMenu != null) && (node.templateName != "split") && (action !== OrgChart.action.exporting)) {
          var nodeMenuButton = t.nodeMenuButton
              .replace("{id}", node.id)
              .replace("{cw}", node.w / 2)
              .replace("{ew}", node.w - (node.padding ? node.padding[1] : 0));
          nodeHtml += nodeMenuButton;
      }

      nodeHtml = openTag + nodeHtml +  OrgChart.grCloseTag;

      return nodeHtml;
  },

  expandCollapseBtn: function (chart, node, layoutConfigs, action, scale) {    
      var html = "";    

      if (action !== OrgChart.action.exporting && node.childrenIds.length > 0 && node.templateName != "split") {            
          if (node.hasPartners){
              var flag = false;
              for(var i = 0; i < node.children.length; i++){
                  if (node.children[i].ppid == undefined && !node.children[i].isPartner){                      
                      flag = true;
                  }
              }

              if (!flag){
                  return '';
              }
          }

          var configName = node.lcn ? node.lcn : "base";
          var layoutConfig = layoutConfigs[configName];            
          var x = 0;
          var y = 0;
          var t = OrgChart.t(node.templateName, node.min, scale);
  
  
          switch (layoutConfig.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
                  x = node.x + (node.w / 2);
                  y = node.y + node.h;
                  break;
  
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  x = node.x + (node.w / 2);
                  y = node.y;
                  break;
  
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  x = node.x;
                  y = node.y + (node.h / 2);
                  break;
  
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  x = node.x + node.w;
                  y = node.y + (node.h / 2);
                  break;
          }
  
          x = x - t.expandCollapseSize / 2;
          y = y - t.expandCollapseSize / 2;
          
          var collapsedChildrenIds = chart.getCollapsedIds(node);
  
          if (collapsedChildrenIds.length) {
              html += OrgChart.expcollOpenTag
                  .replace("{id}", node.id)
                  .replace("{x}", x)
                  .replace("{y}", y);
  
              html += t.plus;
              html += OrgChart.grCloseTag;
          }
          else {
              html += OrgChart.expcollOpenTag
                  .replace("{id}", node.id)
                  .replace("{x}", x)
                  .replace("{y}", y);
  
              html += t.minus;
              html += OrgChart.grCloseTag;
          }
  
          if (html.indexOf("{collapsed-children-count}")){
              var collapsedChildrenCount = OrgChart.collapsedChildrenCount(chart, node);
              html = html.replace("{collapsed-children-count}", collapsedChildrenCount);
          }    
      
      }

      var args = {
          html: html,
          node: node
      };


      OrgChart.events.publish('renderbuttons', [chart, args]);
      

      return args.html;
  },


  link: function (node, obj, scale, bordersByRootIdAndLevel, nodes) {
      var configName = node.lcn ? node.lcn : "base";
      var layoutConfig = obj._layoutConfigs[configName];

      var t = OrgChart.t(node.templateName, node.min, scale);

      var linkArray = [];
      var rotate = 0;       

      var separation = layoutConfig.levelSeparation / 2;
      if (node.layout == OrgChart.mixed || node.layout == OrgChart.tree) {
          separation = layoutConfig.mixedHierarchyNodesSeparation / 2;
      }  

      var pSeparation = 0;

      var rootId = OrgChart.getRootOf(node).id;

      var nodeb = bordersByRootIdAndLevel[rootId][node.sl];       
       
      var parentPartnersHelper = undefined;
      if (node.hasPartners){       
          parentPartnersHelper = {
              ids: [],
              indexes: {},
              ppnodes: {},
              lastLeft: null, 
              firstRight: null,
              maxSidePartnersWithChildren: 0,
              rightIds: [],
              leftIds: [],
              partnerChildrenSplitSeparation: obj.config.partnerChildrenSplitSeparation
          };
              
          for (var i = 0; i < node.children.length; i++) {    
              var cnode = node.children[i];       
              var ppnode = null;            
              if (cnode.ppid != undefined){                
                  ppnode = nodes[cnode.ppid];
              }    
              if (ppnode){            
                  parentPartnersHelper.ppnodes[cnode.id] = ppnode;
                  parentPartnersHelper.ids.push(cnode.id);
                  if (ppnode.isPartner == 1){
                      if (parentPartnersHelper.rightIds.indexOf(ppnode.id) == -1){
                          parentPartnersHelper.rightIds.push(ppnode.id);
                      }

                      parentPartnersHelper.indexes[cnode.id] = parentPartnersHelper.rightIds.indexOf(ppnode.id);
                      if (!parentPartnersHelper.firstRight){
                          parentPartnersHelper.firstRight = cnode;
                      }
            
                  }
                  else if (ppnode.isPartner == 2){      
                      if (parentPartnersHelper.leftIds.indexOf(ppnode.id) == -1){
                          parentPartnersHelper.leftIds.push(ppnode.id);
                      }

                      parentPartnersHelper.indexes[cnode.id] = parentPartnersHelper.leftIds.indexOf(ppnode.id);
                      parentPartnersHelper.lastLeft = cnode;
             
                  }
              }
              else if (!cnode.isPartner){
                  parentPartnersHelper.lastLeft = cnode;
                  if (!parentPartnersHelper.firstRight){
                      parentPartnersHelper.firstRight = cnode;
                  }
              }
          }  

          parentPartnersHelper.maxSidePartnersWithChildren = Math.max(parentPartnersHelper.leftIds.length, parentPartnersHelper.rightIds.length);

          

          if (parentPartnersHelper.maxSidePartnersWithChildren == 0){
              pSeparation = (obj.config.minPartnerSeparation / 2 );
          }
          else{
              pSeparation = (obj.config.minPartnerSeparation / 2 ) + parentPartnersHelper.partnerChildrenSplitSeparation * parentPartnersHelper.maxSidePartnersWithChildren + parentPartnersHelper.partnerChildrenSplitSeparation / 2;
          }

      }

      for (var i = 0; i < node.children.length; i++) {    
          
          var cnode = node.children[i];   
          
          var cnodeb = bordersByRootIdAndLevel[rootId][cnode.sl];
  
          var p = { xa: 0, ya: 0, xb: 0, yb: 0, xc: 0, yc: 0, xd: 0, yd: 0, x: 0, y: 0, rotate: 0 };

          t = OrgChart.t(cnode.templateName, cnode.min, scale);

          var linkTemplate = t.link;

          if (parentPartnersHelper && parentPartnersHelper.ids.indexOf(cnode.id) != -1){       
              switch (layoutConfig.orientation) {
                  case OrgChart.orientation.top:
                  case OrgChart.orientation.top_left:
                      p = OrgChart.ui._linkPpTop(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);                        
                      break;

                  case OrgChart.orientation.bottom:
                  case OrgChart.orientation.bottom_left:
                      p = OrgChart.ui._linkPpBottom(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);     
                      break;

                  case OrgChart.orientation.right:
                  case OrgChart.orientation.right_top:
                      p = OrgChart.ui._linkPpRight(parentPartnersHelper, node, cnode, cnodeb, nodeb, t);
                      break;

                  case OrgChart.orientation.left:
                  case OrgChart.orientation.left_top:
                      p = OrgChart.ui._linkPpLeft(parentPartnersHelper, node, cnode, cnodeb, nodeb,  t);
                      break;
              }                 
          }
          else{
              if ((cnode.isAssistant || cnode.layout == 2) && cnode.rightNeighbor && cnode.rightNeighbor.isSplit) {
                  switch (layoutConfig.orientation) {
                      case OrgChart.orientation.top:
                      case OrgChart.orientation.top_left:
                          p = OrgChart.ui._linkRightToLeft(cnode.rightNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.bottom:
                      case OrgChart.orientation.bottom_left:
                          p = OrgChart.ui._linkRightToLeft(cnode.rightNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.right:
                      case OrgChart.orientation.right_top:
                          p = OrgChart.ui._linkBottomToTop(cnode.rightNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.left:
                      case OrgChart.orientation.left_top:
                          p = OrgChart.ui._linkBottomToTop(cnode.rightNeighbor, cnode, t, separation);
                          break;
                  }
              }
              else if ((cnode.isAssistant || cnode.layout == 2) && cnode.leftNeighbor && cnode.leftNeighbor.isSplit) {
                  switch (layoutConfig.orientation) {
                      case OrgChart.orientation.top:
                      case OrgChart.orientation.top_left:
                          p = OrgChart.ui._linkLeftToRight(cnode.leftNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.bottom:
                      case OrgChart.orientation.bottom_left:
                          p = OrgChart.ui._linkLeftToRight(cnode.leftNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.right:
                      case OrgChart.orientation.right_top:
                          p = OrgChart.ui._linkTopToBottom(cnode.leftNeighbor, cnode, t, separation);
                          break;
  
                      case OrgChart.orientation.left:
                      case OrgChart.orientation.left_top:
                          p = OrgChart.ui._linkTopToBottom(cnode.leftNeighbor, cnode, t, separation);
                          break;
                  }
              }
              else {
                  switch (layoutConfig.orientation) {
                      case OrgChart.orientation.top:
                      case OrgChart.orientation.top_left:                           
                          if (cnode.isPartner == 1){
                              p = OrgChart.ui._linkLeftToRight(node, cnode, t, pSeparation );
                          }
                          else if (cnode.isPartner == 2){
                              p = OrgChart.ui._linkRightToLeft(node, cnode, t, pSeparation);
                          }
                          else{                                                
                              var mid  = cnode.layout == 1 ? undefined : (cnodeb.minY - (cnodeb.minY - nodeb.maxY) / 2);                          
                              p = OrgChart.ui._linkTopToBottom(node, cnode, t, separation, mid);
                          }
                          break;
  
                      case OrgChart.orientation.bottom:
                      case OrgChart.orientation.bottom_left:
                          if (cnode.isPartner == 1){
                              p = OrgChart.ui._linkLeftToRight(node, cnode, t, pSeparation);
                          }
                          else if (cnode.isPartner == 2){
                              p = OrgChart.ui._linkRightToLeft(node, cnode, t, pSeparation);
                          }
                          else{                            
                              var mid  = cnode.layout == 1 ? undefined : (cnodeb.maxY - (cnodeb.maxY - nodeb.minY) / 2);                          
                              p = OrgChart.ui._linkBottomToTop(node, cnode, t, separation, mid);
                          }
          
                          break;
  
                      case OrgChart.orientation.right:
                      case OrgChart.orientation.right_top:
                          if (cnode.isPartner == 1){
                              p = OrgChart.ui._linkTopToBottom(node, cnode, t, pSeparation);
                          }
                          else if (cnode.isPartner == 2){
                              p = OrgChart.ui._linkBottomToTop(node, cnode, t, pSeparation);
                          }
                          else{                            
                              var mid  = cnode.layout == 1 ? undefined : (cnodeb.maxX - (cnodeb.maxX - nodeb.minX) / 2);                          
                              p = OrgChart.ui._linkRightToLeft(node, cnode, t, separation, mid); 
                          }
                        
                          break;
  
                      case OrgChart.orientation.left:
                      case OrgChart.orientation.left_top:
                          if (cnode.isPartner == 1){
                              p = OrgChart.ui._linkTopToBottom(node, cnode, t, pSeparation);
                          }
                          else if (cnode.isPartner == 2){
                              p = OrgChart.ui._linkBottomToTop(node, cnode, t, pSeparation);
                          }
                          else{           
                              var mid  = cnode.layout == 1 ? undefined : (cnodeb.minX - (cnodeb.minX - nodeb.maxX) / 2);                          
                              p = OrgChart.ui._linkLeftToRight(node, cnode, t, separation, mid); 
                          }
                        
                          break;
                  }
              }
         }
         
         
          if (linkTemplate.indexOf('{rounded}') != -1) {
              if ((p.xa == p.xb && p.xa == p.xc && p.xa == p.xd) || (p.ya == p.yb && p.ya == p.yc && p.ya == p.yd)){
                  linkTemplate = linkTemplate.replace("{rounded}", 'M' + p.xa + ',' + p.ya + ' L' + p.xd + ',' + p.yd);
              }
              else{
                  var r1 = OrgChart.ui._roundedEdge(p.xa, p.ya, p.xb, p.yb, p.xc, p.yc);
                  var r2 = OrgChart.ui._roundedEdge(p.xb, p.yb, p.xc, p.yc, p.xd, p.yd);
  
  
                  linkTemplate = linkTemplate.replace("{rounded}", 'M' + r1.x1 + ',' + r1.y1 + ' ' + r1.x2 + ',' + r1.y2
                      + ' Q' + r1.qx1 + ',' + r1.qy1 + ' ' + r1.qx2 + ',' + r1.qy2
                      + ' L' + r2.x2 + ',' + r2.y2
                      + ' Q' + r2.qx1 + ',' + r2.qy1 + ' ' + r2.qx2 + ',' + r2.qy2
                      + ' L' + r2.x3 + ',' + r2.y3);
              }
          }
          else if (linkTemplate.indexOf('{edge}') != -1) {
              linkTemplate = linkTemplate.replace("{edge}", 'M' + p.xa + ',' + p.ya + ' ' + p.xb + ',' + p.yb + ' ' + p.xc + ',' + p.yc + ' L' + p.xd + ',' + p.yd);
          }
          else if (linkTemplate.indexOf('{curve}') != -1) {
              linkTemplate = linkTemplate.replace("{curve}", 'M' + p.xa + ',' + p.ya + ' C' + p.xb + ',' + p.yb + ' ' + p.xc + ',' + p.yc + ' ' + p.xd + ',' + p.yd);
          }
          else {
              linkTemplate = linkTemplate
                  .replaceAll("{xa}", p.xa)
                  .replaceAll("{ya}", p.ya)
                  .replaceAll("{xb}", p.xb)
                  .replaceAll("{yb}", p.yb)
                  .replaceAll("{xc}", p.xc)
                  .replaceAll("{yc}", p.yc)
                  .replaceAll("{xd}", p.xd)
                  .replaceAll("{yd}", p.yd);
          }
    

          linkArray.push(OrgChart.linkOpenTag
              .replace("{id}", node.id)
              .replace("{class}", "link " + cnode.tags.join(" "))
              .replace("{child-id}", cnode.id)
          );

          
          var args = {node: node, cnode: cnode, p: p, html: linkTemplate};
          OrgChart.events.publish('render-link', [obj, args]);
          linkArray.push(args.html);
          var linkFieldsHtml = "";            

          for (var f in obj.config.linkBinding) {
              var val = obj.config.linkBinding[f];
              var data = obj._get(cnode.id);
              if (data) {
                  var replacement = data[val];
                  if (replacement != undefined && replacement != null && t[f] != undefined) {
                      linkFieldsHtml += t[f].replace("{val}", replacement);
                  }
              }
          }

          if (linkFieldsHtml != "") {
              linkFieldsHtml = OrgChart.linkFieldsOpenTag
                  .replace("{x}", p.x)
                  .replace("{y}", p.y)
                  .replace("{rotate}", rotate) + linkFieldsHtml + OrgChart.grCloseTag;
                  
              linkArray.push(linkFieldsHtml);
          }

          linkArray.push(OrgChart.grCloseTag);

      }        

      return linkArray.join('');        
  },

  svg: function (width, height, viewBox, config, content, scale) {
      var html = OrgChart.t(config.template, false, scale).svg
          .replace("{w}", width)
          .replace("{h}", height)
          .replace("{viewBox}", viewBox)
          .replace("{content}", content);

      return html;
  },

  //wrapper: function (width, height, viewBox, config, content, scale) {
  //    var html = OrgChart.templates[config.template].svg
  //        .replace("{w}", width)
  //        .replace("{h}", height)
  //        .replace("{viewBox}", viewBox)
  //        .replace("{content}", content);

  //    return html;
  //},

  exportMenuButton: function (config) {        
      if (config.menu == null) {
          return "";
      }

      var template = OrgChart.t(config.template, false);
      return template.exportMenuButton.replaceAll("{p}", config.padding);     
  },

  _roundedEdge: function (x1, y1, x2, y2, x3, y3) {     
      var qx1, qy1, qx2, qy2 = 0;

      if ((x1 == x2 && x1 == x3)
          || (y1 == y2 && y1 == y3)){   
          qx1 = qx2 = x2;
          qy1 = qy2 = y2;
      }
      else{

          if (x1 != x3 && x2 == x3){           
              qx1 = qx2 = x2;
              qy1 = y2;
              if (y1 < y3){
                  qy2 = y2 + OrgChart.LINK_ROUNDED_CORNERS;
              }
              else if (y1 > y3){
                  qy2 = y2 - OrgChart.LINK_ROUNDED_CORNERS;
              }
          }
  
          if (x1 < x3 && x2 == x3){           
              x2 -= OrgChart.LINK_ROUNDED_CORNERS;
          }
          else if (x1 > x3 && x2 == x3){
              x2 += OrgChart.LINK_ROUNDED_CORNERS;
          } 
  
          if (y1 != y3 && y2 == y3){
              qx1 = x2;
              qy1 = qy2 = y2;
              if (x1 < x3){
                  qx2 = x2 + OrgChart.LINK_ROUNDED_CORNERS;
              }
              else if (x1 > x3){
                  qx2 = x2 - OrgChart.LINK_ROUNDED_CORNERS;
              }
          }
  
          if (y1 < y3 && y2 == y3){
              y2 -= OrgChart.LINK_ROUNDED_CORNERS;
          }
          else if (y1 > y3 && y2 == y3){           
              y2 += OrgChart.LINK_ROUNDED_CORNERS;
          }
      }

      return {
          x1: x1, 
          y1: y1, 
          x2: x2, 
          y2: y2, 
          x3: x3, 
          y3: y3,
          qx1: qx1,
          qy1: qy1,
          qx2: qx2,
          qy2: qy2
      }
  },

  _linkTopToBottom: function (node1, node2, t, separation, mid) {
      var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;       
      xa = node1.x + (node1.w / 2) + t.linkAdjuster.toX;
      ya = node1.y + node1.h + t.linkAdjuster.toY;
      xd = xc = node2.x + (node2.w / 2) + t.linkAdjuster.fromX;
      yd = node2.y + t.linkAdjuster.fromY;
      xb = xa;

      if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
          yb = yc = node1.rightNeighbor.y + node1.rightNeighbor.h + separation;
      }
      else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
          yb = yc = yd;
      }
      else if (node2.templateName == "split") {
          yb = yc = ya + separation;
      }
      else if (mid != undefined) {
          yb = yc = mid;
      }        
      else {
          yb = yc = yd - separation;
      }        
      

      x = xc;
      y = yc + 16;
      return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
  },

  _linkBottomToTop: function (node1, node2, t, separation, mid) {
      var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
      xa = node1.x + (node1.w / 2) + t.linkAdjuster.toX;
      ya = node1.y + t.linkAdjuster.toY;
      xd = xc = node2.x + (node2.w / 2) + t.linkAdjuster.fromX;
      yd = node2.y + node2.h + t.linkAdjuster.fromY;
      xb = xa;

      if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
          yb = yc = node1.rightNeighbor.y - separation;
      }
      else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
          yb = yc = yd;
      }
      else if (node2.templateName == "split") {
          yb = yc = ya - separation;
      }
      else if (mid != undefined){
          yb = yc = mid;
      }    
      else {
          yb = yc = yd + separation;
      }            

      x = xc;
      y = yc - 14;
      return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
  },

  _linkRightToLeft: function (node1, node2, t, separation, mid) {
      var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
      xa = node1.x + t.linkAdjuster.toX;
      ya = node1.y + (node1.h / 2) + t.linkAdjuster.toY;
      xd = node2.x + node2.w + t.linkAdjuster.fromX;
      yd = yc = node2.y + (node2.h / 2) + t.linkAdjuster.fromY;
      yb = ya;

      if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
          xb = xc = node1.rightNeighbor.x - separation;
      }
      else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
          xb = xc = xd;
      }
      else if (node2.templateName == "split") {
          xb = xc = xa - separation;
      }
      else if (mid != undefined){
          xb = xc = mid;
      }
      else {
          xb = xc = xd + separation;
      }

      x = xc - 16;
      y = yc;
      rotate = 90;
      return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
  },

  _linkLeftToRight: function (node1, node2, t, separation, mid) {
      var xa = 0, ya = 0, xb = 0, yb = 0, xc = 0, yc = 0, xd = 0, yd = 0, x = 0, y = 0, rotate = 0;
      xa = node1.x + node1.w + t.linkAdjuster.toX;
      ya = node1.y + (node1.h / 2) + t.linkAdjuster.toY;
      xd = node2.x + t.linkAdjuster.fromX;
      yd = yc = node2.y + (node2.h / 2) + t.linkAdjuster.fromY;
      yb = ya;

      if (node1.rightNeighbor && node1.rightNeighbor.isAssistant && node2.templateName == "split") {
          xb = xc = node1.rightNeighbor.x + node1.rightNeighbor.w + separation;
      }
      else if (node1.templateName == "split" && (node2.isAssistant || node2.layout == 2)) {
          xb = xc = xd;
      }
      else if (node2.templateName == "split") {
          xb = xc = xa + separation;
      }
      else if (mid != undefined){
          xb = xc = mid;
      }
      else {
          xb = xc = xd - separation;
      }
      
      x = xc + 14;
      y = yc;
      rotate = 270;
      return { xa: xa, ya: ya, xb: xb, yb: yb, xc: xc, yc: yc, xd: xd, yd: yd, x: x, y: y, rotate: rotate };
  },

   _linkPpTop: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
      var ppnode = parentPartnersHelper.ppnodes[cnode.id];

      var y = ppnode.y + ppnode.h / 2;
      var mid  = cnodeb.minY - (cnodeb.minY - nodeb.maxY) / 2;                          
      var lineSep  = ((cnodeb.minY - nodeb.maxY) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;  

      var result = OrgChart.ui.__linkPpBottomTop(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
      var x = result.x;
      mid = result.mid;   

      return OrgChart.ui._linkTopToBottom({
          x: x,
          y: y,
          w: 0,
          h: 0
      }, cnode, t, 0, mid);
  },
  
  _linkPpBottom: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
      var ppnode = parentPartnersHelper.ppnodes[cnode.id];

      var y = ppnode.y + ppnode.h / 2;
      var mid  = (cnodeb.maxY - (cnodeb.maxY - nodeb.minY) / 2);                          
      var lineSep  = ((cnodeb.maxY - nodeb.minY) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;  

      var result = OrgChart.ui.__linkPpBottomTop(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
      var x = result.x;
      mid = result.mid;

      return OrgChart.ui._linkBottomToTop({
          x: x,
          y: y,
          w: 0,
          h: 0
      }, cnode, t, 0, mid);
  },
  
  _linkPpLeft: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
      var ppnode = parentPartnersHelper.ppnodes[cnode.id];

      var mid  = (cnodeb.minX - (cnodeb.minX - nodeb.maxX) / 2);                          
      var lineSep  = ((cnodeb.minX - nodeb.maxX) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;  

      var x = ppnode.x + ppnode.w / 2;
      var result = OrgChart.ui.__linkPpLeftRight(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
      var y = result.y;
      mid = result.mid;

      return OrgChart.ui._linkLeftToRight({
          x: x,
          y: y,
          w: 0,
          h: 0
      }, cnode, t, 0, mid);
  },

  _linkPpRight: function(parentPartnersHelper, node, cnode, cnodeb, nodeb, t){
      var ppnode = parentPartnersHelper.ppnodes[cnode.id];

      var mid  = (cnodeb.maxX - (cnodeb.maxX - nodeb.minX) / 2);                          
      var lineSep  = ((cnodeb.maxX - nodeb.minX) / parentPartnersHelper.maxSidePartnersWithChildren) / 4;  

      var x = ppnode.x + ppnode.w / 2;
      var result = OrgChart.ui.__linkPpLeftRight(parentPartnersHelper, node, cnode, mid, lineSep, ppnode);
      var y = result.y;
      mid = result.mid;

      return OrgChart.ui._linkRightToLeft({
          x: x,
          y: y,
          w: 0,
          h: 0
      }, cnode, t, 0, mid);
  },

  __linkPpBottomTop: function(parentPartnersHelper, node, cnode, mid, lineSep, ppnode){
      var x = 0;
      
      if (ppnode.isPartner == 1){    
          x = (ppnode.x - node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.rightIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

          if (parentPartnersHelper.lastLeft  && (x < (parentPartnersHelper.lastLeft.x + parentPartnersHelper.lastLeft.w / 2))){
              if (x < (cnode.x + cnode.w / 2)){
                  mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
              else{        
                  mid -= (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }     
          }
          else{
              if (x < (cnode.x + cnode.w / 2)){
                  mid += (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }
              else{        
                  mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
          }   
      }
      else if (ppnode.isPartner == 2){
          x = (ppnode.x + ppnode.w + node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.leftIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

          if (parentPartnersHelper.firstRight && (x > (parentPartnersHelper.firstRight.x + parentPartnersHelper.firstRight.w / 2))){
              if (x < (cnode.x + cnode.w / 2)){
                  mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
              else{
                  mid -= (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }              
          }
          else{
              if (x < (cnode.x + cnode.w / 2)){
                  mid += (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }
              else{
                  mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
          }
      }        
      return{
          x: x,
          mid: mid
      }
  },

  __linkPpLeftRight: function(parentPartnersHelper, node, cnode, mid, lineSep, ppnode){  
      var y = 0;
      
      if (ppnode.isPartner == 1){    
          y = (ppnode.y - node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.rightIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

          if (parentPartnersHelper.lastLeft  && (y < (parentPartnersHelper.lastLeft.y + parentPartnersHelper.lastLeft.h / 2))){
              if (y < (cnode.y + cnode.h / 2)){
                  mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
              else{        
                  mid -= (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }     
          }
          else{
              if (y < (cnode.y + cnode.h / 2)){
                  mid += (parentPartnersHelper.rightIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }
              else{        
                  mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
          }   
      }
      else if (ppnode.isPartner == 2){
          y = (ppnode.y + ppnode.h + node.partnerSeparation / 2) + (parentPartnersHelper.indexes[cnode.id] * parentPartnersHelper.partnerChildrenSplitSeparation) - ((parentPartnersHelper.leftIds.length - 1) * parentPartnersHelper.partnerChildrenSplitSeparation) / 2;

          if (parentPartnersHelper.firstRight && (y > (parentPartnersHelper.firstRight.y + parentPartnersHelper.firstRight.h / 2))){
              if (y < (cnode.y + cnode.h / 2)){
                  mid -= (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
              else{
                  mid -= (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }              
          }
          else{
              if (y < (cnode.y + cnode.h / 2)){
                  mid += (parentPartnersHelper.leftIds.length  - parentPartnersHelper.indexes[cnode.id]) * lineSep;
              }
              else{
                  mid += (parentPartnersHelper.indexes[cnode.id] + 1) * lineSep;                
              }
          }
      }        
      return{
          y: y,
          mid: mid
      }
  }
};



if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart._validateConfig = function (config) {    
  if (!config) {
      console.error("config is not defined");
  }
  else {
      return true;
  }
  return false;
};

OrgChart._arrayContains = function (arr, obj) {
  if (arr && Array.isArray(arr)) {
      var i = arr.length;
      while (i--)
          if (arr[i] === obj)
              return true;
  }
  return false;
};

OrgChart._interceptions = function (o1, o2) {
  if (!o1) {
      return [];
  }
  if (!o2) {
      return [];
  }

  var r = [];

  if (Array.isArray(o1) && Array.isArray(o2)){
      for (var i1 in o1) {
          for (var i2 in o2) {
              if (o1[i1] == o2[i2]) {
                  r.push(o1[i1])
              }
          }
      }
  }
  else if (Array.isArray(o1) && !Array.isArray(o2)) {
      for (var i1 in o1) {
          for (var i2 in o2) {
              if (o1[i1] == i2) {
                  r.push(o1[i1])
              }
          }
      }
  }
  else if (!Array.isArray(o1) && Array.isArray(o2)) {
      for (var i1 in o1) {
          for (var i2 in o2) {
              if (i1 == o2[i2]) {
                  r.push(o2[i2])
              }
          }
      }
  }

  return r;
};



OrgChart._getTags = function (sourceNode) {
  if (sourceNode.tags && !Array.isArray(sourceNode.tags)) {
      return sourceNode.tags.split(",");
  }
  else if (sourceNode.tags && Array.isArray(sourceNode.tags)) {
      return sourceNode.tags;
  }
  return [];
};

OrgChart._centerPointInPercent = function (element, pageX, pageY) {
  var rect = element.getBoundingClientRect();
  var x = pageX - rect.left;
  var y = pageY - rect.top;

  var relativeXpercent = (x) / (rect.width / 100);
  var relativeYpercent = (y) / (rect.height / 100);

  return [relativeXpercent, relativeYpercent];
};

OrgChart._trim = function (val) {
  return val.replace(/^\s+|\s+$/g, '');
};

OrgChart._getTransform = function (element) {
  var transform = element.getAttribute("transform");
  transform = transform.replace("matrix", "").replace("(", "").replace(")", "");

  if (OrgChart._browser().msie) {
      transform = transform.replace(/ /g, ",");
  }
  transform = OrgChart._trim(transform);
  transform = "[" + transform + "]";
  transform = JSON.parse(transform);

  return transform;
};

OrgChart.getScale = function (viewBox, w, h, initial, max, min, x, y) {
  var scale = 1;
  if (!viewBox && initial === OrgChart.match.boundary) {
      var scaleX = (w) / x;
      var scaleY = (h) / y;
      scale = scaleX > scaleY ? scaleY : scaleX;
  }
  else if (!viewBox && initial === OrgChart.match.width) {
      scale = (w) / x;
  }
  else if (!viewBox && initial === OrgChart.match.height) {
      scale = (h) / y;
  }
  else if (!viewBox) {
      scale = initial;
  }
  else {
      var scaleX = w / viewBox[2];
      var scaleY = h / viewBox[3];
      scale = scaleX > scaleY ? scaleY : scaleX;
  }

  if (scale && scale > max){
      scale = max;
  }    
  if (scale && scale < min){
      scale = min;
  }

  return scale;
};

OrgChart._mergeObject = function (obj1, obj2) {
  var obj3 = {};
  for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
  }
  for (attrname in obj2) {
      obj3[attrname] = obj2[attrname];
  }
  return obj3;
};

OrgChart._lblIsImg = function (config, lbl) {
  if (config.nodeBinding) {
      if (typeof(lbl)  == 'string' && lbl.indexOf("img") != -1 && config.nodeBinding[lbl]) {
          return true;
      }
  }
  return false;
};

OrgChart._getFistImgField = function (config) {
  if (config.nodeBinding) {
      for(var lbl in config.nodeBinding){
          if (lbl.indexOf("img") != -1) {
              return config.nodeBinding[lbl];
          }
      }   
  }
  return false;
};

OrgChart._fieldIsImg = function (config, f) {
  if (config.nodeBinding) {
      for (var b in config.nodeBinding) {
          if (config.nodeBinding[b] == f) {
              return OrgChart._lblIsImg(config, b);
          }
      }
  }
  return false;
};




OrgChart._guid = function () {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

OrgChart.htmlRipple = function (element) {
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ''
      + ' .bg-ripple-container {position: absolute; top: 0; right: 0; bottom: 0; left: 0; }'
      + ' .bg-ripple-container span {transform: scale(0);border-radius:100%;position:absolute;opacity:0.75;background-color:#fff;animation: bg-ripple 1000ms; }'
      + '@-moz-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@-webkit-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@-o-keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}@keyframes bg-ripple {to {opacity: 0;transform: scale(2);}}';


  document.head.appendChild(css);


  var debounce = function (func, delay) {
      var inDebounce;
      inDebounce = undefined;
      return function () {
          var args, context;
          context = this;
          args = arguments;
          clearTimeout(inDebounce);
          return inDebounce = setTimeout(function () {
              return func.apply(context, args);
          }, delay);
      };
  };

  var showRipple = function (e) {
      var pos, ripple, rippler, size, style, x, y;
      ripple = this;
      rippler = document.createElement('span');
      size = ripple.offsetWidth;
      pos = ripple.getBoundingClientRect();
      x = e.pageX - pos.left - (size / 2);
      y = e.pageY - pos.top - (size / 2);
      style = 'top:' + y + 'px; left: ' + x + 'px; height: ' + size + 'px; width: ' + size + 'px;';
      element.rippleContainer.appendChild(rippler);
      return rippler.setAttribute('style', style);
  };

  var cleanUp = function () {
      while (this.rippleContainer.firstChild) {
          this.rippleContainer.removeChild(this.rippleContainer.firstChild);
      }
  };


  var rippleContainer = document.createElement('div');
  rippleContainer.className = 'bg-ripple-container';
  element.addEventListener('mousedown', showRipple);
  element.addEventListener('mouseup', debounce(cleanUp, 2000));
  element.rippleContainer = rippleContainer;
  element.appendChild(rippleContainer);
};

OrgChart._moveToBoundaryArea = function (svgElement, startViewBox, boundary, callback) {
  var endViewBox = startViewBox.slice(0);//clone

  if (startViewBox[0] < boundary.left && startViewBox[0] < boundary.right) {
      endViewBox[0] = boundary.left > boundary.right ? boundary.right : boundary.left;
  }
  if (startViewBox[0] > boundary.right && startViewBox[0] > boundary.left) {
      endViewBox[0] = boundary.left > boundary.right ? boundary.left : boundary.right;
  }
  if (startViewBox[1] < boundary.top && startViewBox[1] < boundary.bottom) {
      endViewBox[1] = boundary.top > boundary.bottom ? boundary.bottom : boundary.top;

  }
  if (startViewBox[1] > boundary.bottom && startViewBox[1] > boundary.top) {
      endViewBox[1] = boundary.top > boundary.bottom ? boundary.top : boundary.bottom;
  }

  if (startViewBox[0] !== endViewBox[0] || startViewBox[1] !== endViewBox[1]) {
      OrgChart.anim(svgElement,
          { viewBox: startViewBox },
          { viewBox: endViewBox },
          300,
          OrgChart.anim.outPow, function () {
              if (callback)
                  callback();
          });
  }
  else if (callback) {
      callback();
  }
};

OrgChart.randomId = function () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

OrgChart._getClientXY = function (e) {
  if (e.type.indexOf("touch") != -1) {
      if (e.changedTouches.length) {
          return {
              x: e.changedTouches[0].clientX,
              y: e.changedTouches[0].clientY
          }
      }
  }
  else {
      return {
          x: e.clientX,
          y: e.clientY
      }
  }
}

OrgChart._getClientTouchesXY = function (e, i) {
  if (e.type.indexOf("touch") != -1) {
      if (e.touches.length < i + 1) {
          return {
              x: null,
              y: null
          }
      }
      else {
          return {
              x: e.touches[i].clientX,
              y: e.touches[i].clientY
          }
      }
  }
  else {
      return {
          x: e.clientX,
          y: e.clientY
      }
  }
}

OrgChart._getOffset = function (object, offset) {
  if (!object)
      return;
  offset.x += object.offsetLeft;
  offset.y += object.offsetTop;

  OrgChart._getOffset(object.offsetParent, offset);
}

OrgChart._getTopLeft = function (div) {
  var offset = { x: 0, y: 0 };
  OrgChart._getOffset(div, offset);
  return offset;
}

OrgChart._getOffsetXY = function (el, e) {
  if (e.type.indexOf("touch") != -1) {
      if (e.touches.length) {
          var offset = OrgChart._getTopLeft(el);
          return {
              x: e.touches[0].pageX - offset.x,
              y: e.touches[0].pageY - offset.y
          }
      }
      else if (e.changedTouches.length) {
          var offset = OrgChart._getTopLeft(el);
          return {
              x: e.changedTouches[0].pageX - offset.x,
              y: e.changedTouches[0].pageY - offset.y
          }
      }
  }
  else {
      return {
          x: e.offsetX,
          y: e.offsetY
      }
  }
}

OrgChart._pinchMiddlePointInPercent = function (el, w, h, e) {
  var offset = OrgChart._getTopLeft(el);
  var t1x = e.touches[0].pageX - offset.x;
  var t1y = e.touches[0].pageY - offset.y;
  var t2x = e.touches[1].pageX - offset.x;
  var t2y = e.touches[1].pageY - offset.y;

  var relativeXpercent = ((t1x - t2x) / 2 + t2x) / (w / 100);
  var relativeYpercent = ((t1y - t2y) / 2 + t2y) / (h / 100);

  return [relativeXpercent, relativeYpercent];
}

OrgChart._browser = function () {
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 71
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  return { 
      opera: isOpera,
      firefox: isFirefox,
      safari: isSafari,
      msie: isIE,
      edge: isEdge,
      chrome: isChrome,
      blink: isBlink
  };
};


OrgChart._menuPosition = function (stickEl, wrapperEl, svgEl) {
  var stickElbcr = stickEl.getBoundingClientRect();
  var svgElbcr = svgEl.getBoundingClientRect();
  var wrapperElbcr = wrapperEl.getBoundingClientRect();
  
  var x = stickElbcr.left - svgElbcr.left;
  var y = stickElbcr.top - svgElbcr.top;

  if ((stickElbcr.top + wrapperElbcr.height) > (svgElbcr.top + svgElbcr.height)){
      y = y - wrapperElbcr.height;
  }

  if ( (stickElbcr.left -  wrapperElbcr.width) <  (svgElbcr.left)){
      x = x + wrapperElbcr.width;
  }

  return { x: x, y: y };
};

OrgChart._getTemplate = function (tags, configTags, defaultTemplate) {
  if (Array.isArray(tags)) {
      for (var i = 0; i < tags.length; i++) {
          var tag = configTags[tags[i]];
          if (tag && tag.template) {
              return tag.template;
          }
      }
  }

  return defaultTemplate;
};

OrgChart._getMin = function (node, config) {   
  if (node.tags && node.tags.length && config.tags){
      for (var i = 0; i < node.tags.length; i++) {
          var tag = config.tags[node.tags[i]];
          if (tag && tag.min === true) {
              return true;
          }
      }
  }

  return config.min;
};

// OrgChart._getCollapsed = function (tags, layoutConfigs) {    
//         for (var i = 0; i < tags.length; i++) {
//             var tag = layoutConfigs[tags[i]];
//             if (tag && tag.collapse) {
//                 return tag.collapse;
//             }
//         }

//     return {};
// };



OrgChart._getSubLevels = function (tags, configTags) {
  if (tags && tags.length){
      for (var i = 0; i < tags.length; i++) {
          var tag = configTags[tags[i]];
          if (tag && tag.subLevels) {
              return tag.subLevels;
          }
      }
  }

  return 0;
};

OrgChart._isHTML = function (str) {
  var div = document.createElement('div');
  div.innerHTML = str;

  for (var c = div.childNodes, i = c.length; i--;) {
      if (c[i].nodeType == 1) return true;
  }
  
  return false;
}


OrgChart._getTestDiv = function () {
  var testDiv = document.getElementById("orgchart_js_test_div");

  if (!testDiv){
      testDiv = document.createElement('div');
      testDiv.id = 'orgchart_js_test_div';
      testDiv.style.position = "fixed";
      testDiv.style.top = "-10000px";
      testDiv.style.left = "-10000px";
      document.body.appendChild(testDiv);
  }

  return testDiv;
}

OrgChart._getLabelSize = function (label) {
  var testDiv = OrgChart._getTestDiv();
  testDiv.innerHTML = '<svg>' + label + '</svg>';

  var textElement = testDiv.querySelector('text');

  return textElement.getBoundingClientRect(); 
}
OrgChart.wrapText = function (text, field) {
  if (field.indexOf("<text") == -1) {
      return text;
  }
  if (field.indexOf("width") == -1) {
      return text;
  }
  if (OrgChart._isHTML(text)) {
      return text;
  }
  var testDiv = OrgChart._getTestDiv();
  field = field.replaceAll("{cw}", 0);
  testDiv.innerHTML = '<svg>' + field + '</svg>';
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(field, "text/xml");
  var xmlText = xmlDoc.getElementsByTagName("text")[0];
  var x = parseFloat( xmlText.getAttribute("x"));
  var y = parseFloat(xmlText.getAttribute("y"));
  var textAnchor = xmlText.getAttribute("text-anchor");
  var width = xmlText.getAttribute("width");
  var textOverflow = xmlText.getAttribute("text-overflow");
  var svgNS = "http://www.w3.org/2000/svg";
  var text_element = testDiv.getElementsByTagName("svg")[0].getElementsByTagName("text")[0];
  var lines = parseFloat(xmlText.getAttribute("text-overflow-lines"));

  if (!lines) {
      lines = 0;
  }

  if (!width) {
      return text;
  }

  width = parseFloat(width);

  if (!x) {
      x = 0;
  }
  if (!y) {
      y = 0;
  }
  if (!x) {
      textAnchor = "start";
  }

  if (!textOverflow) {
      textOverflow = "ellipsis";
  }

  if (textOverflow == "ellipsis") {
      text_element.removeChild(text_element.firstChild);
      text_element.textContent = text;

      var length = text_element.getComputedTextLength();
      var index = 2;
      while (length > width) {
          text_element.textContent = text.substring(0, text.length - index);
          text_element.textContent += "...";
          length = text_element.getComputedTextLength();
          index++;
      }

      if (index > 2) {
          return '<title>' + text + '</title>' + text_element.textContent;
      }
      else {
          return text;
      }
  }
  else if (textOverflow == "multiline") {
      var words = text.split(' ');
      var height = text_element.getBBox().height;

      text_element.textContent = "";


      var tspan_element = document.createElementNS(svgNS, "tspan");
      var text_node = document.createTextNode(words[0]);

      tspan_element.setAttributeNS(null, "x", x);
      tspan_element.setAttributeNS(null, "y", y);
      tspan_element.setAttributeNS(null, "text-anchor", textAnchor);
      tspan_element.appendChild(text_node);
      text_element.appendChild(tspan_element);

      var index = 1;
      var line_count = 1;

      for (var i = 1; i < words.length; i++) {
          var len = tspan_element.firstChild.data.length;
          tspan_element.firstChild.data += " " + words[i];

          if (tspan_element.getComputedTextLength() > width) {
              tspan_element.firstChild.data = tspan_element.firstChild.data.slice(0, len);
              line_count++;

              if (lines !== 0 && line_count > lines) {
                  break;
              }

              var tspan_element = document.createElementNS(svgNS, "tspan");
              tspan_element.setAttributeNS(null, "x", x);
              tspan_element.setAttributeNS(null, "y", y + height * index);
              tspan_element.setAttributeNS(null, "text-anchor", textAnchor);
              text_node = document.createTextNode(words[i]);
              tspan_element.appendChild(text_node);
              text_element.appendChild(tspan_element);

              index++;
          }
      }

      var result = "";
      if (text_element.innerHTML != undefined) {
          result = text_element.innerHTML;
          text_element.innerHTML = "";
      }
      else {
          var innerHTML = "";
          for (var i = text_element.childNodes.length - 1; i >= 0; i--) {
              innerHTML = XMLSerializer().serializeToString(text_element.childNodes[i]) + innerHTML;

              text_element.removeChild(text_element.childNodes[i]);
          }
          result = innerHTML;
      }

      return result;
  }
}




OrgChart._downloadFile = function (type, content, filename, openInNewTab) {
  var blob = new Blob([content], { type: type });

  if (openInNewTab == true){
      var url = URL.createObjectURL(blob);
      var win = window.open(url, '_blank');
      win.focus();
  }
  else{
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
      } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", filename);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
  }
};

OrgChart._getPosition = function (anims, node, x, y) {
  var pos = { x: node.x, y: node.y };
  if (x != undefined) {
      pos.x = x;
  }
  if (y != undefined) {
      pos.y = x;
  }
  if (anims && anims.length == 3) {
      var index = anims[0].indexOf(node.id);
      if (index != -1) {
          if (anims[1][index].transform != undefined) {
              if (x == undefined) {
                  pos.x = anims[1][index].transform[4];
              }
              if (y == undefined) {
                  pos.y = anims[1][index].transform[5];
              }
          }
      }
  }

  return pos;
};

OrgChart._getOpacity = function (anims, node) {
  var opacity = 1;

  if (anims && anims.length == 3) {
      var index = anims[0].indexOf(node.id);
      if (index != -1) {
          if (anims[1][index].opacity != undefined) {
              opacity = anims[1][index].opacity;
          }
      }
  }

  return opacity;
};


OrgChart.t = function (name, minimized, scale) {
  var t = OrgChart.templates[name];

  var tClone = null;
  if (scale != undefined && t.scaleLessThen) {
      var scales = [];
      for (var k in t.scaleLessThen) {
          var v = parseFloat(k);
          if (scale < v) {
              scales.push(v);
          }
      }
      if (scales.length > 0) {
          scales.sort(function (a, b) {
              return a - b;
          });

          var s = t.scaleLessThen[scales[0]];

          for (var j in s) {
              if (tClone == null) {
                  tClone = Object.assign({}, t);
              }
              tClone[j] = s[j];
          }
          
      }
  }

  if (minimized){
      return tClone == null ? (t.min ? t.min : t) : (tClone.min ? tClone.min : tClone);
  }
  else{
      return tClone == null ? t : tClone;
  }
};


OrgChart.setNodeSize = function(node){    
  var t = OrgChart.t(node.templateName, node.min);    
  node.w = t && t.size ? t.size[0] : 0;
  node.h = t && t.size ? t.size[1] : 0;
};

OrgChart._imgs2base64 = function (el, tag, attr, callback) {
  var images = el.getElementsByTagName(tag);
  var count = images.length;
  if (count == 0){
      callback();
  }
  for (var i = 0; i < count; i++) {                
      (function () {
          var index = i;
          var image = images[index];
          OrgChart._getDataUri(image.getAttribute(attr), function (res) {
              if (res.success) {
                  image.setAttribute(attr, res.result);
              }
              if (index == (count - 1)) {
                  callback();
              }
          });
      })();
  }
}

OrgChart._getDataUri = function (url, callback) {
  if (url.indexOf('base64') != -1){
      callback({
          success: false
      });
  }
  else {
      var imgxhr = new XMLHttpRequest();
      imgxhr.open("GET", url);
      imgxhr.responseType = "blob";
      imgxhr.onload = function () {
          if (imgxhr.status === 200) {
              reader.readAsDataURL(imgxhr.response);
          }
          else if (imgxhr.status === 404) {
              callback({
                  success: false,
                  result: imgxhr.status
              });
          }
      };
      var reader = new FileReader();
      reader.onloadend = function () {
          callback({
              success: true,
              result: reader.result
          });
      };
      imgxhr.send();
  }
};


OrgChart._csvToArray = function (strData, strDelimiter){
  strDelimiter = (strDelimiter || ",");
  var objPattern = new RegExp(
      (
          "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
          "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
          "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
  );
  var arrData = [[]];
  var arrMatches = null;
  while (arrMatches = objPattern.exec( strData )){
      var strMatchedDelimiter = arrMatches[1];
      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){
          arrData.push( [] );
      }
      var strMatchedValue;
      if (arrMatches[ 2 ]){
          strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );
      } else {
          strMatchedValue = arrMatches[ 3 ];
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue );
  }
  return( arrData );
};

OrgChart._json2xml = function (nodes) {
  var doc = document.implementation.createDocument("", "", null);
  var nodesEl = doc.createElement("nodes");

  for(var i = 0; i < nodes.length; i++){
      var nodeEl = doc.createElement("node");
      var node = nodes[i];
      for(var name in node){
          var val = node[name];
          if (name == 'tags'){
              val = val.join();
          }
          nodeEl.setAttribute(name, val);
      }
      nodesEl.appendChild(nodeEl);
  }

  doc.appendChild(nodesEl);
  return '<?xml version="1.0" encoding="utf-8" ?>' + new XMLSerializer().serializeToString(doc.documentElement);
};

OrgChart._xml2json = function (text) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(text,"text/xml");
  var nodeEls = doc.getElementsByTagName("node");

  var nodes = [];
  for(var i = 0; i < nodeEls.length; i++){
      var nodeEl = nodeEls[i];
      var node = {};
      for(var j = 0; j < nodeEl.attributes.length; j++){
          var attr = nodeEl.attributes[j];
          var val = attr.value;
          if (attr.name == 'tags'){
              val = val.split(',');
          }
          node[attr.name] = val;
      }
      nodes.push(node);
  }
  return nodes;
};

OrgChart._json2csv = function (nodes) {
  var nodePropArr = [];

  var processNode = function (node) {
      var finalVal = '';
      for (var j = 0; j < nodePropArr.length; j++) {
          var innerValue;
          if (nodePropArr[j] == "reportsTo") {
              innerValue = null;
          }
          else if (node[nodePropArr[j]] == undefined) {
              innerValue = '';
          }
          else {
              innerValue = node[nodePropArr[j]];
          }
          if (innerValue instanceof Date) {
              innerValue = innerValue.toLocaleString();
          };

          innerValue = innerValue === null ? '' : innerValue.toString();
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };
  
  var csvFile = '';

  for (var i = 0; i < nodes.length; i++) {
      for (var prop in nodes[i]) {
          if (!OrgChart._arrayContains(nodePropArr, prop)) {
              nodePropArr.push(prop);
              csvFile += prop + ",";
          }
      }
  }
  csvFile += "\n";


  for (var i = 0; i < nodes.length; i++) {
      csvFile += processNode(nodes[i]);
  }

  return csvFile;
};

OrgChart.accentFold = function(inStr) {
  inStr = inStr.toString().toLowerCase();
  return inStr.replace(
    /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, 
    function (str, a, c, e, i, n, o, s, u, y, ae) {
      if (a) return 'a';
      if (c) return 'c';
      if (e) return 'e';
      if (i) return 'i';
      if (n) return 'n';
      if (o) return 'o';
      if (s) return 's';
      if (u) return 'u';
      if (y) return 'y';
      if (ae) return 'ae';
    }
  );
}


OrgChart.copy = function (obj) {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
      return obj;

  if (obj instanceof Date)
      var temp = new obj.constructor(); //or new Date(obj);
  else
      var temp = obj.constructor();

  for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj['isActiveClone'] = null;
          temp[key] = OrgChart.copy(obj[key]);
          delete obj['isActiveClone'];
      }
  }
  return temp;
}



OrgChart._getScrollSensitivity = function () {
  var browser = OrgChart._browser();

  if (browser.msie && OrgChart.scroll.ie){
      return OrgChart.scroll.ie;
  }    
  else if (browser.edge && OrgChart.scroll.edge){
      return OrgChart.scroll.edge;
  }
  else if (browser.safari && OrgChart.scroll.safari){
      return OrgChart.scroll.safari;
  }
  else if (browser.chrome && OrgChart.scroll.chrome){
      return OrgChart.scroll.chrome;
  }
  else if (browser.firefox && OrgChart.scroll.firefox){
      return OrgChart.scroll.firefox;
  }
  else if (browser.opera && OrgChart.scroll.opera){
      return OrgChart.scroll.opera;
  }
  else{
      return{
          smooth: OrgChart.scroll.smooth,
          speed: OrgChart.scroll.speed
      }
  }
}

OrgChart.isTrial = function (){
  return OrgChart.remote !== undefined;
};

OrgChart.childrenCount = function (chart, node, count){
  if (count == undefined){
      count = 0;
  }

  for( var i = 0; i < node.childrenIds.length; i++){
      var cnode = chart.nodes[node.childrenIds[i]];

      if (cnode){
          count++;
          OrgChart.childrenCount(chart, cnode, count);
      }
  }

  return count;
};

OrgChart.collapsedChildrenCount = function (chart, node, count){
  if (count == undefined){
      count = 0;
  }

  for( var i = 0; i < node.childrenIds.length; i++){
      var cnode = chart.nodes[node.childrenIds[i]];

      if (cnode){
          if (cnode.collapsed === true){
              count++;
          }
          OrgChart.collapsedChildrenCount(chart, cnode, count);
      }
  }

  return count;
};

OrgChart._setMinMaxXY = function (node, b) {
  if (b.minX == null || ((node.x != null) && (node.x < b.minX))) {
      b.minX = node.x;
  }
  if (b.minY == null || ((node.y != null) && (node.y < b.minY))) {
      b.minY = node.y;
  }
  if (b.maxX == null || ((node.x != null) && (node.x + node.w > b.maxX))) {
      b.maxX = node.x + node.w;
  }
  if (b.maxY == null || ((node.y != null) && (node.y + node.h > b.maxY))) {
      b.maxY = node.y + node.h;
  }
};

OrgChart.getStParentNodes = function (node, stParentNodes) {    
  if (!stParentNodes){
      stParentNodes = [];
  }

  while(node.parent){
      node = node.parent;
  }
  if (node.stParent){
      stParentNodes.push(node.stParent);
      OrgChart.getStParentNodes(node.stParent, stParentNodes);
  }
  return stParentNodes;
};

OrgChart.getRootOf = function (node){
  while (node) {
      if (!node.parent){
          break;
      }
      node = node.parent;
  }
  return node;
};

OrgChart._getViewBox = function (svg) {
  var viewBox = null;
  if (svg) {
      viewBox = svg.getAttribute("viewBox");
      viewBox = "[" + viewBox + "]";
      viewBox = viewBox.replace(/\ /g, ",");
      viewBox = JSON.parse(viewBox);
      return viewBox;
  }
  else {
      return null;
  }
};

OrgChart.isNullOrEmpty = function (val) {
  return (val == null || val == undefined || val == '');
};



OrgChart.xScrollUI = function (element, config, requestParams, onSetViewBoxCallback, onDrawCallback) {
  this.element = element;
  this.requestParams = requestParams;
  this.config = config;
  this.onSetViewBoxCallback = onSetViewBoxCallback;
  this.onDrawCallback = onDrawCallback;
  this.pos = 0;
};

OrgChart.xScrollUI.prototype.addListener = function (svg) {
  var that = this;
  if (this.config.mouseScrool != OrgChart.action.xScroll && this.config.mouseScrool != OrgChart.action.scroll) {
      return;
  }
  if (!this.bar) {//disabled
      return;
  }


  function smoothScroll(target, speed, smooth) {
      var moving = false;

      target.addEventListener('wheel', scrolled,  {passive: true});

      function scrolled(e) {
          var delta = 0;
          if (that.config.mouseScrool == OrgChart.action.xScroll){  
              delta = e.deltaX || e.wheelDeltaX; 
              if (!delta){
                  delta = e.deltaY || e.wheelDeltaY; 
              }
          }
          else if (that.config.mouseScrool == OrgChart.action.scroll){
              if (!e.shiftKey){
                  delta = e.deltaX || e.wheelDeltaX;     
              }
              else{
                  delta = e.deltaY || e.wheelDeltaY;     
              }
              if (!delta) {
                  return;
              }
          }
          
          delta = -delta;
          

          delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
          that.pos += -delta * speed;

          var hundredPercentScroll = (parseFloat(that.innerBar.clientWidth) - parseFloat(that.bar.clientWidth));
  

          if (that.pos < 0) {
              that.pos = 0;
          }
          if (that.pos > hundredPercentScroll) {
              that.pos = hundredPercentScroll;
          }

          if (!moving) update()
      }

      function update() {
          moving = true;
          var delta = (that.pos - that.bar.scrollLeft) / smooth;
          if (delta > 0) {
              delta++;
          }
          else if (delta == 0){
              moving = false
              return;
          }
          else {
              delta--;
          }


          if (Math.ceil(that.bar.scrollLeft) == Math.ceil(that.pos)) {
              moving = false
          }
          else {
              that.bar.scrollLeft += delta;
              requestFrame(update);
          }
      }

      var requestFrame = function () { // requestAnimationFrame cross browser
          return (
              window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (func) {
                  setTimeout(func, 1000 / 50);
              }
          );
      }()
  }
  var sensitivity = OrgChart._getScrollSensitivity();
  smoothScroll(svg, sensitivity.speed, sensitivity.smooth);
};

OrgChart.xScrollUI.prototype.create = function (width) {
  if (this.config.showXScroll !== OrgChart.scroll.visible 
      && this.config.mouseScrool !== OrgChart.action.scroll
      && this.config.mouseScrool !== OrgChart.action.xScroll){
      return;
  }
  var that = this;
  if (this.bar){
      this.bar.parentNode.removeChild(this.bar);
  }
  this.bar = document.createElement("div");
  if (this.config.showXScroll !== OrgChart.scroll.visible){
      this.bar.style.visibility = 'hidden';
  }
  this.innerBar = document.createElement("div");

  var p = this.requestParams();

  this.innerBar.innerHTML = "&nbsp";

  Object.assign(this.bar.style, {
      position: "absolute", left: 0, bottom: 0, width: (width /*- this.config.padding*/) + "px", "overflow-x": "scroll", height: "20px"
  });

  this.element.appendChild(this.bar);
  this.bar.appendChild(this.innerBar);

  this.bar.addEventListener("scroll", function () {
      if (this.ignore) {
          this.ignore = false;
          return;
      }

      var p = that.requestParams();
      var onePercentScroll = (parseFloat(that.innerBar.clientWidth) - parseFloat(that.bar.clientWidth)) / 100;        
      var scrollGoLeftInPercentage = this.scrollLeft / onePercentScroll;
      var onePercentView = ((p.boundary.right) - (p.boundary.left)) / 100;      
      
      p.viewBox[0] = scrollGoLeftInPercentage * onePercentView + p.boundary.left;        
      that.onSetViewBoxCallback(p.viewBox);

      clearTimeout(this._timeout);
      this._timeout = setTimeout(function () {
          that.onDrawCallback();
      }, 500);
  });
};

OrgChart.xScrollUI.prototype.setPosition = function () {
  if (!this.bar) {//disabled
      return;
  }
  var p = this.requestParams();
  
  var innerWidth = Math.abs(p.boundary.maxX - p.boundary.minX) * p.scale;
  
  switch (this.config.orientation) {
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          innerHeight = Math.abs(p.boundary.minY * p.scale);
          break;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
          innerWidth = Math.abs(p.boundary.minX * p.scale);
          break;
  }

  this.innerBar.style.width = innerWidth + "px";

  var onePercentView = ((p.boundary.right) - (p.boundary.left)) / 100;

  var scrollGoLeftInPercentage = ((p.viewBox[0] - (p.boundary.left)) / onePercentView);

  if (scrollGoLeftInPercentage < 0) {
      scrollGoLeftInPercentage = 0;
  }
  else if (scrollGoLeftInPercentage > 100) {
      scrollGoLeftInPercentage = 100;
  }

  var onePercentXScroll = (parseFloat(this.innerBar.clientWidth) - parseFloat(this.bar.clientWidth)) / 100;

  var scrollLeft = scrollGoLeftInPercentage * onePercentXScroll;
  this.bar.ignore = true;
  this.bar.scrollLeft = scrollLeft;
  this.pos = this.bar.scrollLeft;

  if (onePercentXScroll <= 0){
      this.bar.style.visibility = 'hidden';
  }    
  else {
      this.bar.style.visibility = '';
  }
};







OrgChart.yScrollUI = function (element, config, requestParams, onSetViewBoxCallback, onDrawCallback) {
  this.element = element;
  this.requestParams = requestParams;
  this.config = config;
  this.onSetViewBoxCallback = onSetViewBoxCallback;
  this.onDrawCallback = onDrawCallback;
  this.pos = 0;
};

OrgChart.yScrollUI.prototype.addListener = function (svg) {
  var that = this;
  if (this.config.mouseScrool != OrgChart.action.yScroll && this.config.mouseScrool != OrgChart.action.scroll) {        
      return;
  }
  



  function smoothScroll(target, speed, smooth) {

      var moving = false;

      target.addEventListener('wheel', scrolled,  {passive: true});
      function scrolled(e) {
          var delta = 0;
          if (that.config.mouseScrool == OrgChart.action.yScroll){  
              delta = e.deltaY || e.wheelDeltaY; 
              if (!delta){
                  delta = e.deltaX || e.wheelDeltaX; 
              }
          }
          else if (that.config.mouseScrool == OrgChart.action.scroll){
              if (!e.shiftKey){
                  delta = e.deltaY || e.wheelDeltaY;     
              }
              else{
                  delta = e.deltaX || e.wheelDeltaX;     
              }                 
              if (!delta) {
                  return;
              }
          }

          delta = -delta;

          delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
      
          that.pos += -delta * speed;

          var hundredPercentScroll = (parseFloat(that.innerBar.clientHeight) - parseFloat(that.bar.clientHeight));    
          if (that.pos < 0) {
              that.pos = 0;
          }
          if (that.pos > hundredPercentScroll) {
              that.pos = hundredPercentScroll;
          }  

          if (!moving) update()
      }

      function update() {
          moving = true;
          var delta = (that.pos - that.bar.scrollTop) / smooth;
          if (delta > 0) {
              delta++;
          }
          else if (delta == 0){
              moving = false
              return;
          }
          else {
              delta--;
          }            
   
          if (Math.ceil(that.bar.scrollTop) == Math.ceil(that.pos)) {
              moving = false
          }
          else {        
              that.bar.scrollTop += delta;        
              requestFrame(update);
          }
      }

      var requestFrame = function () { // requestAnimationFrame cross browser
          return (
              window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (func) {
                  setTimeout(func, 1000 / 50);
              }
          );
      }()
  }
  var sensitivity = OrgChart._getScrollSensitivity();
  smoothScroll(svg, sensitivity.speed, sensitivity.smooth);
};


OrgChart.yScrollUI.prototype.create = function (height) {
  if (this.config.showYScroll !== OrgChart.scroll.visible 
      && this.config.mouseScrool !== OrgChart.action.scroll
      && this.config.mouseScrool !== OrgChart.action.yScroll){
      return;
  }
  var that = this;
  if (this.bar){
      this.bar.parentNode.removeChild(this.bar);
  }
  this.bar = document.createElement("div");
  if (this.config.showYScroll !== OrgChart.scroll.visible){
      this.bar.style.visibility = 'hidden';
  }
  this.innerBar = document.createElement("div");

  this.innerBar.innerHTML = "&nbsp";

  Object.assign(this.bar.style, {
      position: "absolute", right: 0, bottom: 0, height: (height /*- padding*/) + "px", "overflow-y": "scroll", width: "20px"
  });

  this.element.appendChild(this.bar);
  this.bar.appendChild(this.innerBar);

  this.bar.addEventListener("scroll", function () {
      if (this.ignore) {
          this.ignore = false;
          return;
      }

      var p = that.requestParams();
      var onePercentScroll = (parseFloat(that.innerBar.clientHeight) - parseFloat(that.bar.clientHeight)) / 100;

      var scrollGoTopInPercentage = this.scrollTop / onePercentScroll;
      var onePercentView = ((p.boundary.bottom) - (p.boundary.top)) / 100;
      p.viewBox[1] = scrollGoTopInPercentage * onePercentView + p.boundary.top;

      that.onSetViewBoxCallback(p.viewBox);

      clearTimeout(this._timeout);
      this._timeout = setTimeout(function () {
          that.onDrawCallback();
      }, 500);
  });
};

OrgChart.yScrollUI.prototype.setPosition = function () {
  if (!this.bar) {//disabled
      return;
  }
  var p = this.requestParams();
  var innerHeight = p.boundary.maxY * p.scale;

  switch (this.config.orientation) {
      case OrgChart.orientation.bottom:
      case OrgChart.orientation.bottom_left:
          innerHeight = Math.abs(p.boundary.minY * p.scale);
          break;
      case OrgChart.orientation.right:
      case OrgChart.orientation.right_top:
          innerWidth = Math.abs(p.boundary.minX * p.scale);
          break;
  }    

  this.innerBar.style.height = innerHeight + "px";

  var onePercentView = (p.boundary.bottom - p.boundary.top) / 100;

  var scrollGoTopInPercentage = ((p.viewBox[1] - p.boundary.top) / Math.abs(onePercentView));

  if (scrollGoTopInPercentage < 0) {
      scrollGoTopInPercentage = 0;
  }
  else if (scrollGoTopInPercentage > 100) {
      scrollGoTopInPercentage = 100;
  }

  var onePercentYScroll = (parseFloat(this.innerBar.clientHeight) - parseFloat(this.bar.clientHeight)) / 100;
  var scrollTop = scrollGoTopInPercentage * onePercentYScroll;

  this.bar.ignore = true;
  this.bar.scrollTop = scrollTop;    
  this.pos = this.bar.scrollTop;

  if (onePercentYScroll <= 0){
      this.bar.style.visibility = 'hidden';
  }    
  else {
      this.bar.style.visibility = '';
  }
};







OrgChart.prototype.zoom = function ( delta, center, shouldAnimate) {


  var viewBox = this.getViewBox().slice(0); //clone
  var tempViewBox = viewBox;

  var tempViewBoxWidth = viewBox[2];
  var tempViewBoxHeight = viewBox[3];

  if (delta === true) {
      viewBox[2] = viewBox[2] / (OrgChart.SCALE_FACTOR);
      viewBox[3] = viewBox[3] / (OrgChart.SCALE_FACTOR);
  }
  else if (delta === false) {
      viewBox[2] = viewBox[2] * (OrgChart.SCALE_FACTOR);
      viewBox[3] = viewBox[3] * (OrgChart.SCALE_FACTOR);
  }
  else {
      viewBox[2] = viewBox[2] / (delta);
      viewBox[3] = viewBox[3] / (delta);
  }
  if (!center) {
      center = [50, 50];
  }

  viewBox[0] = tempViewBox[0] - (viewBox[2] - tempViewBoxWidth) / (100 / center[0]);
  viewBox[1] = tempViewBox[1] - (viewBox[3] - tempViewBoxHeight) / (100 / center[1]);

  var scale = this.getScale(viewBox);

  viewBox[2] = this.width() / scale;
  viewBox[3] = this.height() / scale;

  if (((delta === true) && (scale < this.config.scaleMax)) || ((delta === false) && (scale > this.config.scaleMin)) || (delta != false && delta != true && scale < this.config.scaleMax && scale > this.config.scaleMin)) {
      this._hideBeforeAnimation();
      var that = this;
      if (shouldAnimate) {
          clearTimeout(that._timeout);

          OrgChart.anim(this.getSvg(), { viewbox: this.getViewBox() }, { viewbox: viewBox }, this.config.anim.duration, this.config.anim.func, function () {
              clearTimeout(that._timeout);
              that._timeout = setTimeout(function () {
                  that._draw(true, OrgChart.action.zoom);
              }, 500);
          });
      }
      else {
          this.setViewBox(viewBox);
          clearTimeout(that._timeout);

          that._timeout = setTimeout(function () {
              that._draw(true, OrgChart.action.zoom);
          }, 500);
      }
  }
};

OrgChart.loading = {};


OrgChart.loading.show = function(chart){
  var html = '<style>@-webkit-keyframes dot-keyframes {0% { opacity: .4; -webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}@keyframes dot-keyframes {0% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}.bg-loading-dots div {margin: 10px;}      .bg-dot-1 {background-color: #039BE5;}.bg-dot-2 {background-color: #F57C00;}.bg-dot-3 {background-color: #FFCA28;}      .bg-loading-dots {text-align: center;width: 100%; position: absolute; top: 0;}.bg-loading-dots--dot {-webkit-animation: dot-keyframes 1.5s infinite ease-in-out;animation: dot-keyframes 1.5s infinite ease-in-out;        border-radius: 10px;display: inline-block;height: 10px;width: 10px;}.bg-loading-dots--dot:nth-child(2) {-webkit-animation-delay: .5s;animation-delay: .5s;}.bg-loading-dots--dot:nth-child(3) {-webkit-animation-delay: 1s;animation-delay: 1s;}</style><div class="bg-loading-dots"><div class="bg-loading-dots--dot bg-dot-1"></div><div class="bg-loading-dots--dot bg-dot-2"></div><div class="bg-loading-dots--dot bg-dot-3"></div></div>';
  var div = document.createElement("div");
  div.id = 'bg-loading';


  div.innerHTML = html;
  
  chart.element.appendChild(div);
};

OrgChart.loading.hide = function(chart){
  var loadingEl = chart.element.querySelector('#bg-loading');
  if (loadingEl){
      loadingEl.parentNode.removeChild(loadingEl);
  }
};


OrgChart.pdfPrevUI = {};

if (!OrgChart.loc){
  OrgChart.loc = {};
}

OrgChart.loc.ppdfCmdTitle = 'PDF Preview';
OrgChart.loc.ppdfSave = 'Save';
OrgChart.loc.ppdfCancel = 'Cancel';
OrgChart.loc.ppdfFormat = 'Format';
OrgChart.loc.ppdfFitToDrwaing = 'Fit';
OrgChart.loc.ppdfA4 = 'A4';
OrgChart.loc.ppdfA3 = 'A3';
OrgChart.loc.ppdfA2 = 'A2';
OrgChart.loc.ppdfA1 = 'A1';
OrgChart.loc.ppdfLetter = 'Letter';
OrgChart.loc.ppdfLegal = 'Legal';
OrgChart.loc.ppdfLayout = 'Layout';
OrgChart.loc.ppdfPortrait = 'Portrait';
OrgChart.loc.ppdfLandscape = 'Landscape';
OrgChart.loc.ppdfFittopagewidth = 'Fit to page width';
OrgChart.loc.ppdfMargin = 'Margin';
OrgChart.loc.ppdfHeader = 'Header';
OrgChart.loc.ppdfFooter = 'Footer';
OrgChart.loc.ppdfScale = 'Scale';


OrgChart.pdfPrevUI.show = function (chart, options) {
  options = chart._defaultExportOptions(options, 'pdf')

  var div1 = document.createElement("div");
  div1.id = 'bg-ppdf-btns';
  Object.assign(div1.style, {
      position: 'absolute', top: 0, left: 0, 'background-color': '#fff', 'z-index': 5, margin: "0 0 0 -250px", 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',  width: '250px', height: '100%', "font-family": "Roboto,Helvetica", 'color': '#757575', 'text-align': 'right', 'padding' : '10px'
  });

  chart.element.appendChild(div1);

  div1.innerHTML = '<h1>' 
  + OrgChart.loc.ppdfCmdTitle
  + '</h1>'
  + '<div><button type="button" id="bg-prev-save" style="font-size: 14px; width: 90px;">' + OrgChart.loc.ppdfSave + '</button>&nbsp;<button type="button" id="bg-prev-cancel" style="width: 90px;font-size: 14px;">' + OrgChart.loc.ppdfCancel + '</button></div>'
  + '<div style="margin-top:30px; height:10px;border-bottom:1px solid #eeeeee;"></div>'
  + '<div style="padding-top:30px;"><label for="bg-size">' + OrgChart.loc.ppdfFormat + ': </label><select id="bg-ppdf-size" style="color: #757575; width: 150px; font-size: 14px;" id="bg-size">'
  + '<option value="fit">' + OrgChart.loc.ppdfFitToDrwaing + '</option>'
  + '<option value="A4">' + OrgChart.loc.ppdfA4 + '</option>'    
  + '<option value="A3">' + OrgChart.loc.ppdfA3 + '</option>'    
  + '<option value="A2">' + OrgChart.loc.ppdfA2 + '</option>'    
  + '<option value="A1">' + OrgChart.loc.ppdfA1 + '</option>'      
  + '<option value="Letter">' + OrgChart.loc.ppdfLetter + '</option>'      
  + '<option value="Legal">' + OrgChart.loc.ppdfLegal + '</option>'      
  + '</select></div>'
  + '<div style="padding-top:10px;"><label for="bg-ppdf-layout">' + OrgChart.loc.ppdfLayout + ': </label><select id="bg-ppdf-layout" style="color: #757575; width: 150px;font-size: 14px;" >'
  + '<option value="false">' + OrgChart.loc.ppdfPortrait + '</option>'
  + '<option value="true">' + OrgChart.loc.ppdfLandscape + '</option>'
  + '</select></div>'
  + '<div style="padding-top:10px;"><label for="bg-scale">' + OrgChart.loc.ppdfScale + ': </label><select id="bg-ppdf-scale" style="color: #757575; width: 150px;font-size: 14px;" id="bg-scale">'
  + '<option value="fit">'+ OrgChart.loc.ppdfFittopagewidth + '</option>'
  + '<option value="10">10%</option>'
  + '<option value="20">20%</option>'
  + '<option value="30">30%</option>'
  + '<option value="40">40%</option>'
  + '<option value="50">50%</option>'
  + '<option value="60">60%</option>'
  + '<option value="70">70%</option>'
  + '<option value="80">80%</option>'
  + '<option value="90">90%</option>'
  + '<option value="100">100%</option>'
  + '<option value="110">110%</option>'
  + '<option value="120">120%</option>'
  + '<option value="130">130%</option>'
  + '<option value="140">140%</option>'
  + '<option value="150">150%</option>'
  + '<option value="160">160%</option>'
  + '<option value="170">170%</option>'
  + '<option value="180">180%</option>'
  + '<option value="190">190%</option>'
  + '<option value="200">200%</option>'
  + '</select></div>'
  + '<div style="margin-top:10px;margin-bottom:10px; height:10px;border-bottom:1px solid #eeeeee;"></div>'
  + '<div style="padding-top:10px;"><label for="bg-ppdf-header">' + OrgChart.loc.ppdfHeader + ': </label><input id="bg-ppdf-header" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>' 
  + '<div style="padding-top:10px;"><label for="bg-ppdf-footer">' + OrgChart.loc.ppdfFooter + ': </label><input id="bg-ppdf-footer" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>'  
  + '<div style="padding-top:10px;"><label for="bg-ppdf-margin">' + OrgChart.loc.ppdfMargin + ': </label><input id="bg-ppdf-margin" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>';   

  var div2 = document.createElement("div");
  div2.id = 'bg-ppdf-wrapper';
  Object.assign(div2.style, {
      'overflow-y': 'scroll', position: 'absolute', top: 0, left: '270px', 'background-color': '#eee', width: (chart.width() - 270) + 'px', height: '100%'
  });

  chart.element.appendChild(div2);

  div2.innerHTML = '<div id="bg-ppdf-content" style="width: 100%;margin-top:10px;margin-bottom:10px;opacity:0;"></div>';

  var bgppdfformat = chart.element.querySelector('#bg-ppdf-size');
  var bgppdflayout = chart.element.querySelector('#bg-ppdf-layout');
  var bgppdfscale = chart.element.querySelector('#bg-ppdf-scale');
  var bgppdfmargin = chart.element.querySelector('#bg-ppdf-margin');
  var bgppdfheader = chart.element.querySelector('#bg-ppdf-header');
  var bgppdffooter = chart.element.querySelector('#bg-ppdf-footer');    

  bgppdfformat.value = options.format;
  bgppdflayout.value = options.landscape;
  bgppdfscale.value = options.scale;
  bgppdfmargin.value = options.margin;
  bgppdfheader.value = options.header;
  bgppdffooter.value = options.footer;

  OrgChart.anim(chart.element.querySelector('#bg-ppdf-btns'), { margin: [0,0,0,-250] },  { margin: [0,0,0,0] }, 300, OrgChart.anim.outSin, function(){
      chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
  });

  chart.element.querySelector('#bg-prev-cancel').addEventListener('click', function(){
      OrgChart.pdfPrevUI.hide(chart);
  });

  chart.element.querySelector('#bg-prev-save').addEventListener('click', function(){
      chart.exportPDF(options);
      OrgChart.pdfPrevUI.hide(chart);
  });

  OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);

  bgppdfformat.addEventListener('change', function(){
      OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
          chart.element.querySelector('#bg-ppdf-content').innerHTML = '';
          options.format = bgppdfformat.value;
          chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
          OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
      });        
  });

  bgppdflayout.addEventListener('change', function(){
      OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
          chart.element.querySelector('#bg-ppdf-content').innerHTML = '';
          options.landscape = bgppdflayout.value == 'true';
          chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
          OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
      });        
  });

  bgppdfscale.addEventListener('change', function(){
      OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
          chart.element.querySelector('#bg-ppdf-content').innerHTML = '';
          options.scale = bgppdfscale.value;
          chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
          OrgChart.pdfPrevUI._showHide(bgppdfformat, bgppdflayout, bgppdfscale);
      });        
  });

  var timeotmargin;
  bgppdfmargin.addEventListener('keyup', function(){
      clearTimeout(timeotmargin);
      timeotmargin = setTimeout(function(){
          OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
              chart.element.querySelector('#bg-ppdf-content').innerHTML = '';                
              var margin = bgppdfmargin.value.split(',');
              if (margin.length == 4){
                  for(var t = 0; t < margin.length; t++){
                      margin[t] = parseInt(margin[t]);
                  }
                  options.margin = margin;
                  chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
              }
          }); 
      }, 1000);
  });

  var timeotheader;
  bgppdfheader.addEventListener('keyup', function(){
      clearTimeout(timeotheader);
      timeotheader = setTimeout(function(){
          OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
              chart.element.querySelector('#bg-ppdf-content').innerHTML = '';                                
              options.header = bgppdfheader.value;
              chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
          }); 
      }, 1000);
  });

  var timeotfooter;
  bgppdffooter.addEventListener('keyup', function(){
      clearTimeout(timeotfooter);
      timeotfooter = setTimeout(function(){
          OrgChart.anim(chart.element.querySelector('#bg-ppdf-content'), { opacity: 1 },  { opacity: 0 }, 300, OrgChart.anim.inSin, function(){
              chart.element.querySelector('#bg-ppdf-content').innerHTML = '';                                
              options.footer = bgppdffooter.value;
              chart.exportPDF(options, OrgChart.pdfPrevUI._handler);
          }); 
      }, 1000);
  });
};

OrgChart.pdfPrevUI._showHide = function(bgppdfformat, bgppdflayout, bgppdfscale){
  if (bgppdfformat.value == 'A4' 
      || bgppdfformat.value == 'A3'
      || bgppdfformat.value == 'A2'
      || bgppdfformat.value == 'A1'
      || bgppdfformat.value == 'Letter'
      || bgppdfformat.value == 'Legal'){        
      bgppdflayout.parentNode.style.display = 'block';
      bgppdfscale.parentNode.style.display = 'block';
  }
  else{        
      bgppdflayout.parentNode.style.display = 'none';
      bgppdfscale.parentNode.style.display = 'none';
  }
};


OrgChart.pdfPrevUI._handler = function (sender, req, svg) {
  var options = req.options;
  var pages = req.pages;
  var marginTop = options.margin[0];
  var marginBottom = options.margin[2];
  var el = document.createElement('div');
  el.innerHTML = svg.outerHTML;        
  if(OrgChart._browser().msie){//fix ie 11 svg.outerHTML not supported
      el.innerHTML = new XMLSerializer().serializeToString(svg)
  }
  var newSvg = el.querySelector('svg');     

  var bgppdfcontent = sender.element.querySelector('#bg-ppdf-content');
  for(var i = 0; i < pages.length; i++){
      var iframe = document.createElement('iframe');

      Object.assign(iframe.style, {
          'display': 'block', 'margin': '10px auto', 'border': '1px solid #eeeeee', 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      });

      bgppdfcontent.appendChild(iframe);
  
      if (newSvg && newSvg.style.backgroundColor){
          iframe.style.backgroundColor = newSvg.style.backgroundColor;           
      }
      else{
          iframe.style.backgroundColor = '#fff';
      }
      var doc = iframe.contentWindow.document;  
      doc.open();
      


      iframe.style.width = (pages[i].size.w + 'px');
      iframe.style.height = (pages[i].size.h + 'px');
      iframe.style.margin = '10 auto';

      if (pages[i].backgroundColor){
          iframe.style.backgroundColor = pages[i].backgroundColor;           
      }

      
      var header = options.header;
      if (pages[i].header){
          header = pages[i].header;
      }
      if (header){
          header = header.replace('{current-page}', i + 1).replace('{total-pages}', pages.length);
      }

      var footer = options.footer;
      if (pages[i].footer){
          footer = pages[i].footer;
      }
      if (footer){
          footer = footer.replace('{current-page}', i + 1).replace('{total-pages}', pages.length);
      }    


      if (pages[i].html){ 
          doc.write(OrgChart._exportHtml(pages[i].html + req.styles, options, pages[i].innerSize.w, pages[i].innerSize.h, header, footer));
      }
      else{            
          newSvg.setAttribute('viewBox', pages[i].vb);
          doc.write(OrgChart._exportHtml(el.innerHTML + req.styles, options, pages[i].innerSize.w, pages[i].innerSize.h, header, footer));
      }

      var bgheader = doc.getElementById('bg-header');
      var bgfooter = doc.getElementById('bg-footer'); 
      if (bgheader){
          var top = marginTop - bgheader.offsetHeight - 7;
          bgheader.style.top = top + 'px';
      }          

      if (bgfooter){
          var bottom = marginBottom - bgfooter.offsetHeight - 7;
          bgfooter.style.bottom = bottom + 'px';
      }       
      doc.close();
  }
  
  var bgppdfwrapper = sender.element.querySelector('#bg-ppdf-content');
  OrgChart.anim(bgppdfwrapper, { opacity: 0 },  { opacity: 1 }, 300, OrgChart.anim.outSin);        
};


OrgChart.pdfPrevUI._getViewBox = function (svg) {
  var viewBox = null;
  if (svg) {
      viewBox = svg.getAttribute("viewBox");
      viewBox = "[" + viewBox + "]";
      viewBox = viewBox.replace(/\ /g, ",");
      viewBox = JSON.parse(viewBox);
      return viewBox;
  }
  else {
      return null;
  }
};

OrgChart._exportHtml = function(html, options, w, h, header, footer){    
  var smargin = '';
  for(var j = 0; j < options.margin.length; j++){
      smargin += (options.margin[j] + 'px ');
  }
  var result = '<!DOCTYPE html><html style="margin:0;padding:0;"><head></head><body style="margin:0; padding:0;">'
      + '<div style="margin: ' + smargin  + ';overflow:hidden;width:' + w + 'px;height:' + (h) + 'px">';

      if (header){
          result += '<div id="bg-header" style="width:' + w + 'px;color:#757575;position:absolute;left:' + options.margin[3] + 'px;top:0;">' +  header + '</div>';
      }

      result += html;

      if (footer){
          result += '<div id="bg-footer" style="width:' + w + 'px;color:#757575;position:absolute;left:' + options.margin[3] + 'px;bottom:0;">' +  footer + '</div>';
      }

  result +=  '</div>';     
  result += '</body></html>';

  return result;
}


OrgChart.pdfPrevUI.hide = function (chart) {
  var bgppdfwrapper = chart.element.querySelector('#bg-ppdf-wrapper');

  if (bgppdfwrapper){
      OrgChart.anim(bgppdfwrapper, {opacity: 1}, {opacity: 0}, 300, OrgChart.anim.inSin, function(){
          bgppdfwrapper.parentNode.removeChild(bgppdfwrapper);
          var bgppdfbtns = chart.element.querySelector('#bg-ppdf-btns');            
          OrgChart.anim(bgppdfbtns, {margin: [0,0,0,0]}, {margin: [0,0,0,-280]}, 300, OrgChart.anim.inSin, function(){
              bgppdfbtns.parentNode.removeChild(bgppdfbtns);
          });
      });
  }
};


if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.events.on('renderdefs', function(sender, args){
  for (var i = 0; i < sender.config.clinks.length; i++) {
      var clink = sender.config.clinks[i];
      var templateName = clink.template;
      if (!templateName){
          templateName = 'orange';
      }
      var t = OrgChart.clinkTemplates[templateName];
      args.defs += t.defs;
  }
});



OrgChart.events.on('render', function(sender, args){
  sender._clink(sender, args);
});


OrgChart.prototype._clink = function(sender, args){
  var html = '';
  for (var i = 0; i < this.config.clinks.length; i++) {
      var clink = this.config.clinks[i];

      


      if (args.res.visibleNodeIds.indexOf(clink.from) == -1){
          continue;
      }

      
      if (args.res.visibleNodeIds.indexOf(clink.to) == -1){
          continue;
      }

      var fromnode = sender.getNode(clink.from);
      var tonode = sender.getNode(clink.to); 
      

      var from_x = fromnode.x;
      var from_y = fromnode.y;

      var to_x = tonode.x;
      var to_y = tonode.y;



      var a = { };
      var b = { };

      var c_fromnode_x = (from_x + fromnode.w / 2);
      var c_tonode_x = (to_x + tonode.w / 2);
      var c_fromnode_y = (from_y + fromnode.h / 2);
      var c_tonode_y = (to_y + tonode.h / 2);

      var left = 1;
      
      switch (this.config.orientation) {
          case OrgChart.orientation.top:
          case OrgChart.orientation.top_left:
              if (c_fromnode_x <= c_tonode_x){
                  left = 1;
                  a.x = c_fromnode_x + fromnode.w / 10;
                  b.x = c_tonode_x - tonode.w / 10;
              }
              else{
                  left = -1;
                  a.x = c_fromnode_x - fromnode.w / 10;
                  b.x = c_tonode_x + tonode.w / 10;
              }
              
              if (from_y == to_y){
                  left = 1;
                  a.y = from_y;
                  b.y = to_y;
              }
              else if (from_y > to_y){
                  a.y = from_y;
                  b.y = to_y + tonode.h;
              }
              else{
                  a.y = from_y + fromnode.h;
                  b.y = to_y;
              }
              break;
          case OrgChart.orientation.bottom:
          case OrgChart.orientation.bottom_left:
              if (c_fromnode_x <= c_tonode_x){
                  left = -1;
                  a.x = c_fromnode_x + fromnode.w / 10;
                  b.x = c_tonode_x + tonode.w / 10;
              }
              else{
                  left = 1;
                  a.x = c_fromnode_x - fromnode.w / 10;
                  b.x = c_tonode_x + tonode.w / 10;
              }
              
              if (from_y == to_y){
                  left = -1;
                  a.y = from_y + fromnode.h;
                  b.y = to_y + tonode.h;
              }
              else if (from_y > to_y){
                  a.y = from_y;
                  b.y = to_y + tonode.h;
              }
              else{
                  a.y = from_y + fromnode.h;
                  b.y = to_y;
              }
              break;                    
          case OrgChart.orientation.left:
          case OrgChart.orientation.left_top:
              if (c_fromnode_y <= c_tonode_y){
                  left = -1;
                  a.y = c_fromnode_y + fromnode.h / 5;
                  b.y = c_tonode_y + tonode.h / 5;
              }
              else{
                  left = 1;
                  a.y = c_fromnode_y - fromnode.h / 5;
                  b.y = c_tonode_y + tonode.h / 5;
              }
              
              if (from_x == to_x){
                  left = -1;
                  a.x = from_x;
                  b.x = to_x;
              }
              else if (from_x > to_x){
                  a.x = from_x;
                  b.x = to_x + tonode.w;
              }
              else{
                  a.x = from_x + fromnode.w;
                  b.x = to_x;
              }
              break;
          case OrgChart.orientation.right:
          case OrgChart.orientation.right_top:
              if (c_fromnode_y <= c_tonode_y){
                  left = 1;
                  a.y = c_fromnode_y + fromnode.h / 5;
                  b.y = c_tonode_y + tonode.h / 5;
              }
              else{
                  left = -1;
                  a.y = c_fromnode_y - fromnode.h / 5;
                  b.y = c_tonode_y + tonode.h / 5;
              }
              
              if (from_x == to_x){
                  left = 1;
                  a.x = from_x + fromnode.w;
                  b.x = to_x + tonode.w;
              }
              else if (from_x > to_x){
                  a.x = from_x;
                  b.x = to_x + tonode.w;
              }
              else{
                  a.x = from_x + fromnode.w;
                  b.x = to_x;
              }
          break;
      }

      function findD(A, B, left){ // if left = 1 the D is left of the line AB 
          if (left == undefined){
              left = 1;
          }
          var nx = B.x - A.x;
          var ny = B.y - A.y;
          var dist = Math.sqrt(Math.pow((B.x - A.x), 2) + Math.pow((B.y - A.y), 2)) / 3;
          dist = dist / (Math.sqrt(nx * nx + ny * ny) * left) * OrgChart.CLINK_CURVE;
          return {
              x : A.x + nx / 2 - ny * dist, 
              y : A.y + ny / 2 + nx * dist
          }
      }

      function findM(A, B, C){ // if left = 1 the D is left of the line AB 
          var abx = (B.x - A.x) / 2 + A.x;
          var aby = (B.y - A.y) / 2 + A.y;

          return{
              x: (abx - C.x) / 2 + C.x,
              y: (aby - C.y) / 2 + C.y
          }
      }

      var c = findD(a, b, left);

      var templateName = clink.template;
      if (!templateName){
          templateName = 'orange';
      }
      var t = OrgChart.clinkTemplates[templateName];

      html += '<g c-link-from="{from}" c-link-to="{to}">'
          .replace("{from}", fromnode.id)
          .replace("{to}", tonode.id)
          + t.link.replaceAll('{d}', 'M{a.x},{a.y} C{a.x},{a.y} {c.x},{c.y} {b.x},{b.y}')
              .replaceAll('{b.x}', b.x)
              .replaceAll('{b.y}', b.y)
              .replaceAll('{a.x}', a.x)
              .replaceAll('{a.y}', a.y)
              .replaceAll('{c.x}', c.x)
              .replaceAll('{c.y}', c.y);

      var m = findM(a, b, c);

      if (clink.label){
          html += t.label
              .replace('{x}', m.x)
              .replace('{y}', m.y)
              .replace('{val}', clink.label);
      }
      
      html += OrgChart.grCloseTag;
  }

  args.content += html;
};


OrgChart.prototype.addClink = function(from, to, label, template){
  this.removeClink(from, to);
  this.config.clinks.push({
      from: from, 
      to: to, 
      label: label, 
      template: template
  });
  return this;
};

OrgChart.prototype.removeClink = function(from, to){
  for(var i = this.config.clinks.length - 1; i >= 0; i--){
      var clink = this.config.clinks[i];
      if (clink.from == from && clink.to == to){
          this.config.clinks.splice(i, 1);
      }
  }
  return this;
};

OrgChart.clinkTemplates = {};

OrgChart.clinkTemplates.orange = {
  defs: '<marker id="arrowOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
  link: '<path marker-start="url(#dotOrange)" marker-end="url(#arrowOrange)" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
  label: '<text fill="#F57C00" text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};

OrgChart.clinkTemplates.blue = {
  defs: '<marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
  link: '<path marker-start="url(#dotBlue)" marker-end="url(#arrowBlue)" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
  label: '<text fill="#039BE5"  text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};

OrgChart.clinkTemplates.yellow = {
  defs: '<marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
  link: '<path marker-start="url(#dotYellow)" marker-end="url(#arrowYellow)" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
  label: '<text fill="#FFCA28"  text-anchor="middle" x="{x}" y="{y}">{val}</text>'
};



if (typeof (OrgChart) == "undefined") {
  OrgChart = {};
}

OrgChart.events.on('renderdefs', function(sender, args){
  for (var i = 0; i < sender.config.slinks.length; i++) {
      var slink = sender.config.slinks[i];
      var templateName = slink.template;
      if (!templateName){
          templateName = 'orange';
      }
      var t = OrgChart.slinkTemplates[templateName];
      args.defs += t.defs;
  }
});


OrgChart.events.on('render', function(sender, args){
  sender._slinks(sender, args);
});

OrgChart.prototype._slinks = function (sender, args) {


  var html = '';

  var scale = this.getScale();
  var boundary = args.res.boundary;

  function _findM(p1, p2){
      return {
          x: (p1[0] + p2[0]) / 2,
          y: (p1[1] + p2[1]) / 2
      };
  }

  function _slinks(fromnode, tonode, reverse){        
      var path = [];
      var parentNode = null;
      var align = "left";

      var configName = fromnode.lcn ? fromnode.lcn : "base";
      var layoutConfig = sender._layoutConfigs[configName];


      switch (layoutConfig.orientation) {
          case OrgChart.orientation.top:
          case OrgChart.orientation.top_left:
          case OrgChart.orientation.bottom:
          case OrgChart.orientation.bottom_left:
              if (tonode.x > fromnode.x) {
                  align = "right";
              }
              break;
          case OrgChart.orientation.left:
          case OrgChart.orientation.left_top:
          case OrgChart.orientation.right:
          case OrgChart.orientation.right_top:
              align = "top";
              if (tonode.y > fromnode.y) {
                  align = "bottom";
              }
              break;
      }

      var t = OrgChart.t(fromnode.templateName, fromnode.min, scale);
      var separation = layoutConfig.levelSeparation;
      if ((fromnode.parent && fromnode.parent.layout == OrgChart.mixed) || (fromnode.parent && fromnode.parent.layout == OrgChart.tree)) {
          separation = layoutConfig.mixedHierarchyNodesSeparation;
      }  
      var point = {
          p: fromnode.x + fromnode.w / 2 + t.expandCollapseSize,
          q: fromnode.y,
          r: fromnode.x + fromnode.w / 2 + t.expandCollapseSize,
          s: boundary.minY + separation
      };

      if (fromnode.level == tonode.level){
          parentNode = tonode;
          switch (layoutConfig.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
                  path.push([point.p, point.q]);
                  path.push([point.p, point.q - separation / 3]);
                  t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                  path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                  path.push([path[path.length - 1][0], parentNode.y]);
              break;
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  point.q = fromnode.y + fromnode.h;
                  point.s = boundary.maxY - separation;
                  path.push([point.p, point.q]);
                  path.push([point.r, fromnode.y + fromnode.h + separation / 3]); 
                  t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                  path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h]);                   
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  point.p = fromnode.x;
                  point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  point.r = boundary.minX - separation;
                  point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  path.push([point.p, point.q]);
                  path.push([fromnode.x - separation / 3, point.q]);
                  t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                  path.push([parentNode.x, path[path.length - 1][1]]); 
                  break;
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  point.p = fromnode.x + fromnode.w;
                  point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  point.r = boundary.maxX + separation;
                  point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  path.push([point.p, point.q]);
                  path.push([fromnode.x + fromnode.w + separation / 3, point.q]);
                  t = OrgChart.t(parentNode.templateName, parentNode.min, scale);
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                  path.push([parentNode.x + parentNode.w, path[path.length - 1][1]]); 
                  break;
          }
      }
      else{
          switch (layoutConfig.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
                  path.push([point.p, point.q]);
                  path.push([point.r, fromnode.y - separation / 3]);
                  break;
              case OrgChart.orientation.bottom:
              case OrgChart.orientation.bottom_left:
                  point.q = fromnode.y + fromnode.h;
                  point.s = boundary.maxY - separation;
                  path.push([point.p, point.q]);
                  path.push([point.r, fromnode.y + fromnode.h + separation / 3]);                    
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  point.p = fromnode.x;
                  point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  point.r = boundary.minX - separation;
                  point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  path.push([point.p, point.q]);
                  path.push([fromnode.x - separation / 3, point.q]);
                  break;
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  point.p = fromnode.x + fromnode.w;
                  point.q = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  point.r = boundary.maxX + separation;
                  point.s = fromnode.y + fromnode.h / 2 + t.expandCollapseSize;
                  path.push([point.p, point.q]);
                  path.push([fromnode.x + fromnode.w + separation / 3, point.q]);
                  break;
          }
          
          var n = fromnode;
          
          while (parentNode == null) {
              var hasIntersect = false;
              var pn = n.parent;
              
              var ln = pn.leftNeighbor;
              var rn = pn.rightNeighbor;
              
              if (pn.id == tonode.id) {
                  parentNode = pn;
              }
              else if (OrgChart._intersects(pn, point, sender.config)) {
                  point = OrgChart._addPoint(pn, path, sender.config, point, align);
                  hasIntersect = true;
              }

              if (pn.id != tonode.id) {
                  while (ln) {
                      if (ln.id == tonode.id) {
                          parentNode = ln;
                          break;
                      }
                      if (OrgChart._intersects(ln, point, sender.config)) {
                          point = OrgChart._addPoint(ln, path, sender.config, point, align);
                          hasIntersect = true;
                      }
                      ln = ln.leftNeighbor;
                  }

                  while (rn) {
                      if (rn.id == tonode.id) {
                          parentNode = rn;
                          break;
                      }
                      if (OrgChart._intersects(rn, point, sender.config)) {
                          point = OrgChart._addPoint(rn, path, sender.config, point, align);
                          hasIntersect = true;
                      }
                      rn = rn.rightNeighbor;
                  }
              }   

  
              if (!hasIntersect) {
                  var x = path[path.length - 1][0];
                  var y = 0;
                  if (pn.parent) {
                      separation = layoutConfig.levelSeparation;
                      if (pn.parent.layout == OrgChart.mixed || pn.parent.layout == OrgChart.tree) {
                          separation = layoutConfig.mixedHierarchyNodesSeparation;
                      }  
      
                      switch (layoutConfig.orientation) {
                          case OrgChart.orientation.top:
                          case OrgChart.orientation.top_left:
                              y = pn.parent.y + pn.parent.h + separation * (2 / 3);
                              break;
                          case OrgChart.orientation.bottom:
                          case OrgChart.orientation.bottom_left:
                              y = pn.parent.y - separation * (2 / 3);
                              break;
                          case OrgChart.orientation.left:
                          case OrgChart.orientation.left_top:
                              x = pn.parent.x + pn.parent.w + separation * (2 / 3);
                              y = path[path.length - 1][1];
                              break;
                          case OrgChart.orientation.right:
                          case OrgChart.orientation.right_top:
                              x = pn.parent.x - separation * (2 / 3);
                              y = path[path.length - 1][1];
                              break;
                      }
                  }
                  
                  path.push([x, y]);
              }
              n = pn;
          }

          t = OrgChart.t(parentNode.templateName, parentNode.min, scale);

          path.splice(path.length - 1, 1);
          switch (layoutConfig.orientation) {
              case OrgChart.orientation.top:
              case OrgChart.orientation.top_left:
                  path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h]);
                  break;
              case OrgChart.orientation.bottom:                    
              case OrgChart.orientation.bottom_left:                    
                  path.push([parentNode.x + parentNode.w / 2 + t.expandCollapseSize, path[path.length - 1][1]]);
                  path.push([path[path.length - 1][0], parentNode.y]);
                  break;
              case OrgChart.orientation.left:
              case OrgChart.orientation.left_top:
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                  path.push([parentNode.x + parentNode.w, path[path.length - 1][1]]);
                  break;
              case OrgChart.orientation.right:
              case OrgChart.orientation.right_top:
                  path.push([path[path.length - 1][0], parentNode.y + parentNode.h / 2 + t.expandCollapseSize]);
                  path.push([parentNode.x, path[path.length - 1][1]]);
                  break;
          }
      }

      var templateName = slink.template;
      if (!templateName){
          templateName = 'orange';
      }
      var t = OrgChart.slinkTemplates[templateName];   

      var m = null; 
      
      switch(t.labelPosition){
          case 'start':{
              m = { x: path[1][0], y: path[1][1] };
              break;
          }
          case 'middle':{
              var mPointIndex = Math.ceil(path.length / 2);
              m = _findM(path[mPointIndex], path[mPointIndex - 1]);
              break;
          }
          case 'end':{ 
              m = { x: path[path.length - 2][0], y: path[path.length - 2][1] };
              break;
          }
      }
  
      if (reverse){
          path = path.reverse();
      }

      path[0] = "M" + path[0].join(",");

      for (var j = 1; j < path.length; j++) {
          path[j] = "L" + path[j].join(",");
      }        

      var pathStr = path.join(" ");        

      html += '<g c-link-from="{from}" c-link-to="{to}">'
          .replace("{from}", fromnode.id)
          .replace("{to}", tonode.id)
          + t.link.replaceAll("{d}", pathStr);


      if (slink.label){
          var testLlabel = t.label
              .replace('{x}', m.x)
              .replace('{y}', m.y)
              .replace('{val}', slink.label);

          var rect = OrgChart._getLabelSize(testLlabel);
          
          var adjustLabelY = - (rect.height / 2);

          switch (layoutConfig.orientation) {
              case OrgChart.orientation.bottom:                    
              case OrgChart.orientation.bottom_left:                    
                  adjustLabelY = rect.height;
                  break;
          }

          html += t.label
              .replace('{x}', m.x)
              .replace('{y}', m.y + adjustLabelY)
              .replace('{val}', slink.label);
      }

      

      html += OrgChart.grCloseTag;
  

      args.content += html;
  }


  for (var i = 0; i < this.config.slinks.length; i++) {
      var slink = this.config.slinks[i];

      if (args.res.visibleNodeIds.indexOf(slink.from) != -1 && args.res.visibleNodeIds.indexOf(slink.to) != -1){  
          var fromnode = sender.getNode(slink.from);
          var tonode = sender.getNode(slink.to);  

          if (fromnode.level >= tonode.level){
              _slinks(fromnode, tonode, false);
          }
          else{
              _slinks(tonode, fromnode, true);
          }
      }
  }
};

OrgChart.prototype.addSlink = function(from, to, label, template){
  this.removeClink(from, to);
  this.config.slinks.push({
      from: from, 
      to: to, 
      label: label, 
      template: template
  });
  return this;
};

OrgChart.prototype.removeSlink = function(from, to){
  for(var i = this.config.slinks.length - 1; i >= 0; i--){
      var slink = this.config.slinks[i];
      if (slink.from == from && slink.to == to){
          this.config.slinks.splice(i, 1);
      }
  }
  return this;
};

OrgChart.slinkTemplates = {};

OrgChart.slinkTemplates.orange = {
  defs: '<marker id="arrowSlinkOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
  link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkOrange)" marker-end="url(#arrowSlinkOrange)" stroke-linejoin="round" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
  label: '<text dominant-baseline="middle" fill="#F57C00" alignment-baseline="middle" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  labelPosition: 'middle'
};

OrgChart.slinkTemplates.blue = {
  defs: '<marker id="arrowSlinkBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
  link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkBlue)" marker-end="url(#arrowSlinkBlue)" stroke-linejoin="round" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
  label: '<text fill="#039BE5" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  labelPosition: 'middle'
};

OrgChart.slinkTemplates.yellow = {
  defs: '<marker id="arrowSlinkYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
  link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkYellow)" marker-end="url(#arrowSlinkYellow)" stroke-linejoin="round" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
  label: '<text  fill="#FFCA28" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  labelPosition: 'middle'
};







OrgChart.events.on('redraw', function(sender, args){
if (!sender.config.miniMap){
  return;
}
var canvas = OrgChart.miniMap._getCanvas(sender);
var ctx = canvas.getContext("2d");

//start reset scale, translation and other...
canvas.width = canvas.width;
canvas.height = canvas.height;
//end   

var width = (sender.response.boundary.maxX - sender.response.boundary.minX);
var height = (sender.response.boundary.maxY - sender.response.boundary.minY);

var scale = Math.min(canvas.width / width, canvas.height / height);
var adjustX = (canvas.width - (width * scale)) / 2; //find the center
var adjustY = (canvas.height - (height * scale)) / 2; //find the center
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.translate(-sender.response.boundary.minX * scale + adjustX, -sender.response.boundary.minY * scale + adjustY);
ctx.scale(scale, scale);  

var subTreeLevel = 0;
drawnNodes = [];
checkedLevel = [];
function iterate(c, n){
  
  if (Array.isArray(n)){
    for(var i = 0; i < n.length; i++){
      iterate(c, n[i])
    }
    return;
  }
 
  ctx.fillStyle = OrgChart.miniMap.colors[3];
  ctx.beginPath();
  ctx.lineWidth = "0.5";
  ctx.fillRect(n.x, n.y, n.w, n.h);
  ctx.strokeRect(n.x, n.y, n.w, n.h);

  for(var i = 0; i < n.stChildrenIds.length; i++){
    subTreeLevel++;
    if (!checkedLevel.includes(n.id)) {
      
      if (subTreeLevel == 1 ) {
        ctx.fillStyle = OrgChart.miniMap.colors[0];
      }
      else if (subTreeLevel == 2 ) {
        ctx.fillStyle = OrgChart.miniMap.colors[1];
      }

      else if (subTreeLevel == 3 ) {  
        ctx.fillStyle = OrgChart.miniMap.colors[2];
     }
     
     ctx.beginPath();
     ctx.fillRect(n.x, n.y, n.w, n.h);
     ctx.strokeRect(n.x, n.y, n.w, n.h);
     checkedLevel.push(n.id);

    }

    iterate(c, c.getNode(n.stChildrenIds[i]));
    subTreeLevel--;
  }
  
  for(var i = 0; i < n.childrenIds.length; i++){
    iterate(c, c.getNode(n.childrenIds[i]))
  }
}

iterate(sender, sender.roots);



var x = sender.getViewBox()[0];
var y = sender.getViewBox()[1];
var w = sender.getViewBox()[2];
var h = sender.getViewBox()[3];
ctx.lineWidth = 0.5 / scale;
ctx.strokeStyle = "#f57c00";
ctx.strokeRect(x, y, w, h);
ctx.globalAlpha = 0.4;
ctx.fillStyle = OrgChart.miniMap.selectorBackgroundColor;
ctx.fillRect(x, y, w, h);

});


OrgChart.miniMap = {};
OrgChart.miniMap._getCanvas = function(sender){
var canvas = sender.element.querySelector('[data-id="mini-map"]');

if (!canvas){

var canvas = document.createElement('canvas');
canvas.width = 250;
canvas.height = 140;
canvas.setAttribute('data-id', 'mini-map');
canvas.style.display = 'inline-block';
canvas.style.backgroundColor = OrgChart.miniMap.backgroundColor;

var canvasContent = document.createElement("div");
canvasContent.style.position = 'absolute';
canvasContent.style.bottom = '10px';
canvasContent.style.left = '10px';
canvasContent.style.border = '1px solid #aeaeae';
canvasContent.style.padding = '5px';
canvasContent.style.margin = sender.config.padding +'px';
canvasContent.style.backgroundColor = OrgChart.miniMap.backgroundColor;
canvasContent.appendChild(canvas);   
sender.element.appendChild(canvasContent);
}

return canvas;

}

OrgChart.miniMap.colors = ["#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575"];
OrgChart.miniMap.selectorBackgroundColor = "white";
OrgChart.miniMap.backgroundColor = "white";

OrgChart._search = {};

OrgChart._search.search = function(dataArray, search, searchInFileds, retrieveFields, searchDisplayField, searchFieldsWeight){
  var result = [];
  var searchLower = search.toLowerCase();
  var searchPhrases = searchLower.split(' ');


  searchPhrases = searchPhrases.filter(function (value, currentIndex, self) {
      return self.indexOf(value) === currentIndex;
    });

  var id___score = {};    
  for(var i = 0; i < dataArray.length; i++){
      var data = dataArray[i];
      for (var j = 0; j < searchInFileds.length; j++){
          var __searchInFiled = searchInFileds[j];
          if (!OrgChart.isNullOrEmpty(data[__searchInFiled])){
              var value = data[__searchInFiled];
              var search = OrgChart._search.searchAndComputeScore(searchPhrases, value, __searchInFiled, searchFieldsWeight);
              if (search != null){
                  var id = data.id;
                  if (!id___score[id]){
                      id___score[id] = search.__score;
                      OrgChart._search.addNodeToResult(result, retrieveFields, data, search, __searchInFiled, searchDisplayField);
                  }
                  else if (id___score[id] && id___score[id] < search.__score){
                      id___score[id] = search.__score;
                      for(var  z = result.length - 1;  z >=0 ; z--){
                          if (result[z].id == id){
                              result.splice(z, 1);
                          }
                      }
                      OrgChart._search.addNodeToResult(result, retrieveFields, data, search, __searchInFiled, searchDisplayField);
                  }
              }
          }
      }
  }

  result.sort( function ( a, b ) {
      if ( a.__score < b.__score ){
        return 1;
      }
      if ( a.__score > b.__score ){
        return -1;
      }
      return 0;
    } );

    return result;
};

OrgChart._search.addNodeToResult = function(result, retrieveFields, data, search, __searchFiled, searchDisplayField){
  var resultNode = {};
  resultNode['id'] = data['id'];
  if(!OrgChart.isNullOrEmpty(data[searchDisplayField])){
      resultNode[searchDisplayField] = data[searchDisplayField];
  }
  for (var  i = 0; i < retrieveFields.length; i++) {
      var retrieveField = retrieveFields[i];
      if (!OrgChart.isNullOrEmpty(data[retrieveField])){
          if (OrgChart.isNullOrEmpty(resultNode[retrieveField])){
              resultNode[retrieveField] = data[retrieveField];
          }
      }
  }

  if (search != null){
      if (OrgChart.isNullOrEmpty(resultNode['__score'])){
          resultNode['__score']= search.__score;
      }
      if (OrgChart.isNullOrEmpty(resultNode['__searchField'])){
          resultNode['__searchField']= __searchFiled;
      }
      if (OrgChart.isNullOrEmpty(resultNode['__searchMarks'])){
          resultNode['__searchMarks']= search.__searchMarks;
      }
  }

  result.push(resultNode);
}

OrgChart._search.searchAndComputeScore = function(searchPhrases, searchIn, fieldName, searchFieldsWeight){
  if (OrgChart.isNullOrEmpty(searchIn))
  {
      return null;
  }
  if (OrgChart.isNullOrEmpty(searchPhrases))
  {
      return null;
  }
  if (!searchPhrases.length)
  {
      return null;
  }

  var searchInLower = searchIn.toLowerCase();
  var indexes = OrgChart._search.searchIndexesOf(searchInLower, searchPhrases);

  if (!indexes.length){
      return null;
  }


  var onePercent = searchInLower.length / 100;
  var sumMathces = 0;    
  var minStart = 0;
  var orderPercentWeight = sumMathces > 0 ? 100 : 0;

  if (indexes.length){
      minStart = indexes[0].start;
      for(var i = 0; i < indexes.length; i++){
          sumMathces += indexes[i].length;
          if (indexes[i].start < minStart){
              minStart = indexes[i].start;
          }
          if (i >= 1 && indexes[i - 1].start > indexes[i].start){
              orderPercentWeight = 0;
              break;
          }
      }
  }
  var lengthPercentWeight = 0;
  if (sumMathces != 0){
      lengthPercentWeight = (sumMathces / onePercent);
  }

  var minStartPercentWeight = sumMathces > 0 ? 100 : 0;
  if (minStart != 0)
  {
      minStartPercentWeight = 100 - (minStart / onePercent);
  }

  var filedNamePercentWeight = 0;
  if (searchFieldsWeight && searchFieldsWeight[fieldName]){
      filedNamePercentWeight = searchFieldsWeight[fieldName];
  }    

  if (lengthPercentWeight > 0)
  {
      lengthPercentWeight = lengthPercentWeight / 100 * 20;
  }
  if (minStartPercentWeight > 0)
  {
      minStartPercentWeight = minStartPercentWeight / 100 * 20;
  }
  if (orderPercentWeight > 0)
  {
      orderPercentWeight = orderPercentWeight / 100 * 20;
  }
  if (filedNamePercentWeight > 0)
  {
      filedNamePercentWeight = filedNamePercentWeight / 100 * 40;
  }

  var __score = parseInt(lengthPercentWeight + minStartPercentWeight + orderPercentWeight + filedNamePercentWeight);
  

  if (__score > 100)
  {
      __score = 100;
  }

  
  indexes.sort( function ( a, b ) {
      if ( a.start < b.start ){
          return -1;
      }
        if ( a.start > b.start ){
          return 1;
      }        
      return 0;
    } );

  var __searchMarks = searchIn;
  for (var i = indexes.length - 1; i >= 0; i--)
  {
      __searchMarks = __searchMarks.insert(indexes[i].start + indexes[i].length, "</mark>");
      __searchMarks = __searchMarks.insert(indexes[i].start, "<mark>");
  }


  return {
      __searchMarks:  __searchMarks,
      __score: __score
  };
}

OrgChart._search.searchIndexesOf = function(str, values){
  var indexes = [];
  if (!OrgChart.isNullOrEmpty(str))
  {
      for (var m = 0; m < values.length; m++)
      {
          var value = values[m];
          if (!OrgChart.isNullOrEmpty(value))
          {
              var tempIndex = 0;
              while (true)
              {
                  tempIndex = str.indexOf(value, tempIndex);
                  if (tempIndex > -1){
                      indexes.push(
                          {
                              length: value.length,
                              start: tempIndex
                          });
                      tempIndex += value.length;
                  }
                  else
                  {
                      break;
                  }
              }
          }

      }
  }


  indexes.sort( function ( a, b ) {
      if ( a.length < b.length ){
        return 1;
      }
      if ( a.length > b.length ){
        return -1;
      }
      if ( a.start < b.start ){
          return -1;
      }
        if ( a.start > b.start ){
          return 1;
      }        
      return 0;
    } );
    

    indexes = indexes.filter(function (current){
                      var alredyExist = false;
                      for(var i = 0; i < indexes.length; i++){                          
                          var start = indexes[i].start;
                          var end = indexes[i].start + indexes[i].length - 1;
                                     
                          var startNew = current.start;
                          var endNew = current.start + current.length - 1;

                          
                          if (start == startNew && end == endNew){
                              alredyExist = false;
                              break;
                          }

                          if (start >= startNew && end <= endNew){
                              alredyExist = true;
                              break;
                          }

                          else if (start <= startNew && end >= endNew){
                              alredyExist = true;
                              break;
                          }
                      }
                      return !alredyExist;

      });

  return indexes;
}
OrgChart.events.on('redraw', function(sender, args){
  if (!sender.config.state){
      return;
  }

  var exp = [];
  var min = [];
  function iterate(n){
      if (Array.isArray(n)){
          for(var i = 0; i < n.length; i++){
              iterate(n[i])
          }
          return;
      }

      if (typeof(n.id) != 'string' || (typeof(n.id) == 'string' && n.id.indexOf('split') == -1 && n.id.indexOf('mirror') == -1)){
          exp.push(n.id);
          if (n.min == true){
              min.push(n.id);
          }
      }
      
      for(var i = 0; i < n.stChildren.length; i++){
          iterate(n.stChildren[i])
      }
      
      for(var i = 0; i < n.children.length; i++){
          iterate(n.children[i])
      }
  }

  iterate(sender.roots);       
 
  OrgChart.state._put(sender.width(), 
      sender.height(), 
      sender.response.viewBox, 
      exp, 
      min, 
      sender.response.adjustify,
      sender.config.state);
});


OrgChart.state = {};


OrgChart.state._buildStateNames = function(name){
  return{
      paramScale: name + '-scale',
      paramX: name + '-x',
      paramY: name + '-y',
      paramExp: name + '-exp',
      paramMin: name + '-min',
      paramAdjustify: name + '-adjustify'
  }
}


OrgChart.state._put = function(w, h, vb, exp, min , adjustify, state){
  if (!state){       
      return;
  } 

  var sn = OrgChart.state._buildStateNames(state.name);
  var stateParams = {
      scale: Math.min(w / vb[2], h / vb[3]),
      x: vb[0],
      y: vb[1],
      exp: exp,
      min: min,
      adjustify: adjustify
  };

  if (state.writeToUrlParams){  
      var urlSearchParams = new URLSearchParams(window.location.search);
      if (urlSearchParams.has(sn.paramScale)){
          urlSearchParams.set(sn.paramScale, stateParams.scale);
      }
      else{
          urlSearchParams.append(sn.paramScale, stateParams.scale);
      }

      if (urlSearchParams.has(sn.paramX)){
          urlSearchParams.set(sn.paramX, stateParams.x);
      }
      else{
          urlSearchParams.append(sn.paramX, stateParams.x);
      }

      if (urlSearchParams.has(sn.paramY)){
          urlSearchParams.set(sn.paramY, stateParams.y);
      }
      else{
          urlSearchParams.append(sn.paramY, stateParams.y);
      }
      if (urlSearchParams.has(sn.paramExp)){
          urlSearchParams.set(sn.paramExp, stateParams.exp.join('*'));
      }
      else{
          urlSearchParams.append(sn.paramExp, stateParams.exp.join('*'));
      }

      if (urlSearchParams.has(sn.paramMin)){
          urlSearchParams.set(sn.paramMin, stateParams.min.join('*'));
      }
      else{
          urlSearchParams.append(sn.paramMin, stateParams.min.join('*'));
      }

      if (urlSearchParams.has(sn.paramAdjustify)){
          urlSearchParams.set(sn.paramAdjustify, stateParams.adjustify.x + '*' + stateParams.adjustify.y);
      }
      else{
          urlSearchParams.append(sn.paramAdjustify, stateParams.adjustify.x + '*' + stateParams.adjustify.y);
      }

      window.history.replaceState(null, null, "?" + urlSearchParams);
  }

  if (state.writeToIndexedDB){
      stateParams.id = state.name;
  
      OrgChart.idb.put(stateParams, function(success){
          if (success == false){
              console.error("Cannot write row - " + state.name);
          }
      });
  }

  if (state.writeToLocalStorage){
      OrgChart.localStorage.setItem(state.name, JSON.stringify(stateParams));   
  }
}

OrgChart.state._get = function(state, w, h, callback){   
  if (!state){           
      callback(null);
      return;
  } 

  var sn = OrgChart.state._buildStateNames(state.name);
  
  if (state.readFromUrlParams){
      var urlSearchParams = new URLSearchParams(window.location.search);

      if (urlSearchParams.has(sn.paramScale) 
          && urlSearchParams.has(sn.paramX) 
          && urlSearchParams.has(sn.paramY) 
          && urlSearchParams.has(sn.paramExp) 
          && urlSearchParams.has(sn.paramMin) 
          && urlSearchParams.has(sn.paramAdjustify)){
              
          var result  = {};
          var scale = parseFloat(urlSearchParams.get(sn.paramScale));
          var x = parseFloat(urlSearchParams.get(sn.paramX));
          var y = parseFloat(urlSearchParams.get(sn.paramY));

          var vb = [];
          vb[0] = x;
          vb[1] = y;
          vb[2] =  w / scale; 
          vb[3] =  h / scale;   

          result.vb = vb;
          result.scale = scale;
          result.x = x;
          result.y = y;

          result.exp = urlSearchParams.get(sn.paramExp).split('*');
          result.min = urlSearchParams.get(sn.paramMin).split('*');
          var adjustify = urlSearchParams.get(sn.paramAdjustify).split('*');
          result.adjustify = {
              x: parseFloat(adjustify[0]),
              y: parseFloat(adjustify[1])
          };

          callback(result);
          return;
      }
      else if (!state.readFromIndexedDB && !state.readFromLocalStorage){
          callback(null);
          return;
      }
  }

  if (state.readFromLocalStorage){
      var result = OrgChart.localStorage.getItem(state.name);   

      if (result != null){
          result = JSON.parse(result);
          var vb = [];
          vb[0] = result.x;
          vb[1] = result.y;
          vb[2] =  w / result.scale; 
          vb[3] =  h / result.scale;   

          result.vb = vb;
          callback(result);
          return;
      }
      else if (!state.readFromIndexedDB) {
          callback(null);
          return;
      }
  }

  if (state.readFromIndexedDB){
      OrgChart.idb.read(state.name, function(success, result){
          if (success == false){
              console.error("Cannot read from - " + state.name);
              callback(null);       
          }
          else if (success == null){
              callback(null);     
          }
          else{
              var vb = [];
              vb[0] = result.x;
              vb[1] = result.y;
              vb[2] =  w / result.scale; 
              vb[3] =  h / result.scale;   
  
              result.vb = vb;

              callback(result);
          }
      });
  }
}


OrgChart.state.clear = function(stateName){   
  if (!stateName){
      return false;
  }

  var sn = OrgChart.state._buildStateNames(stateName);

  var urlSearchParams = new URLSearchParams(window.location.search);
  if (urlSearchParams.has(sn.paramScale)){
      urlSearchParams.delete(sn.paramScale);
  }

  if (urlSearchParams.has(sn.paramX)){
      urlSearchParams.delete(sn.paramX);
  }

  if (urlSearchParams.has(sn.paramY)){
      urlSearchParams.delete(sn.paramY);
  }
  
  if (urlSearchParams.has(sn.paramExp)){
      urlSearchParams.delete(sn.paramExp);
  }

  if (urlSearchParams.has(sn.paramMin)){
      urlSearchParams.delete(sn.paramMin);
  }

  if (urlSearchParams.has(sn.paramAdjustify)){
      urlSearchParams.delete(sn.paramAdjustify);
  }

  window.history.replaceState(null, null, "?" + urlSearchParams);

  OrgChart.idb.delete(stateName, function(success){
      if (success == false){
          console.error("Cannot delete row - " + stateName);
      }
  });
}




OrgChart._magnify = {};

OrgChart.prototype.magnify = function (id, scale, front, anim, callback) {    
  if (!anim){
      anim = this.config.anim;
  }
  var node = this.getNode(id);
  var nodeElement = this.getNodeElement(id);

  if (!node && !nodeElement){
      return;
  }
  var magnify = OrgChart._magnify[id];
  if (magnify){
      if (magnify.timer != undefined){
          clearInterval(magnify.timer);
      }        
      if (magnify.timerBack != undefined){
          clearInterval(magnify.timerBack);
      }
      nodeElement.setAttribute('transform', "matrix(" + magnify.transformStart.toString() + ")");
      OrgChart._magnify[id] == null;
  }

  if (front){
      nodeElement = nodeElement.cloneNode(true);
      var svg = this.getSvg();
      svg.appendChild(nodeElement);
  }
  var transformStart = OrgChart._getTransform(nodeElement);
  var transformEnd = JSON.parse(JSON.stringify(transformStart));
  transformEnd[0] = scale;
  transformEnd[3] = scale;
  var newWidth = node.w + node.w * (scale - 1);
  var newHeight = node.h + node.h * (scale - 1);

  transformEnd[4] += (node.w - newWidth   ) / 2;
  transformEnd[5] += (node.h - newHeight ) / 2;
  var timer = OrgChart.anim(nodeElement, {transform: transformStart}, {transform: transformEnd}, anim.duration, anim.func);

  OrgChart._magnify[id] = {
      timer: timer,
      transformStart: transformStart,
      nodeElement: nodeElement,
      front: front
  };   
  
  if (callback){
      callback(nodeElement);
  }    
};

OrgChart.prototype.magnifyBack = function (id, anim, callback) {
  if (!anim){
      anim = this.config.anim;
  }
  var magnify = OrgChart._magnify[id];
  if (!magnify){
      return;
  }
  if (magnify.timer != undefined){
      clearInterval(magnify.timer);
  }        
  if (magnify.timerBack != undefined){
      clearInterval(magnify.timerBack);
  }
  var backTransformStart = OrgChart._getTransform(magnify.nodeElement);

  magnify.timerBack = OrgChart.anim(magnify.nodeElement, {transform: backTransformStart}, {transform: magnify.transformStart}, anim.duration, anim.func, function(elements){
      var nodeId = elements[0].getAttribute('node-id');
      if (OrgChart._magnify[nodeId]){
          if (OrgChart._magnify[nodeId].front){
              elements[0].parentNode.removeChild(elements[0]);    
              OrgChart._magnify[nodeId] = null;        
          }
      }
      if(callback){
          callback(elements[0]);
      }
  });
};
