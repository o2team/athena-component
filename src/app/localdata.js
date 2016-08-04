var localData = {
    hname: location.hostname ? location.hostname : 'localStatus',
    isLocalStorage: !!window.localStorage,
    dataDom: null,

    // 初始化userData
    initDom: function(){
        if(!this.dataDom){
            try{
            	// 这里使用hidden的input元素
                this.dataDom = document.createElement('input');
                this.dataDom.type = 'hidden';
                this.dataDom.style.display = 'none';
                // 这是userData的语法
                this.dataDom.addBehavior('#default#userData');
                document.body.appendChild(this.dataDom);
                var exDate = new Date();
                exDate = exDate.getDate()+30;
                // 设定过期时间
                this.dataDom.expires = exDate.toUTCString();
            }catch(ex){
                return false;
            }
        }
        return true;
    },
    set: function(key, value){
        if(this.isLocalStorage){
            window.localStorage.setItem(key, value);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                this.dataDom.setAttribute(key,value);
                this.dataDom.save(this.hname)
            }
        }
    },
    get: function(key){
        if(this.isLocalStorage){
            return window.localStorage.getItem(key);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                return this.dataDom.getAttribute(key);
            }
        }
    },
    remove: function(key){
        if(this.isLocalStorage){
            localStorage.removeItem(key);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                this.dataDom.removeAttribute(key);
                this.dataDom.save(this.hname)
            }
        }
    }
}

var forceRefreshId = localData.get('forceRefreshId');
if(whenToForceRefresh !== forceRefreshId) {
    localData.remove('bundle.js');
    localData.remove('timestamp');
    localData.remove('forceRefreshId');
    console.log('Force to refresh the Localstorage because the ID has been changed...');
}

function loadXMLDoc(url) {
  var xmlhttp = null;

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }

  if (xmlhttp) {
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        fillScript(xmlhttp.responseText);
        localData.set('bundle.js', xmlhttp.responseText);
        // 缓存10天
        localData.set('timestamp', new Date().getTime()+864000000);
        localData.set('forceRefreshId', whenToForceRefresh);
        console.log('Okay, we have saved the bundle.js into Localstorage for 10 days...');
      }
    };

    xmlhttp.open('GET', url, true);
    xmlhttp.send(null);
  } else {
    
  }
}

function fillScript(bundle) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(bundle));
    document.head.appendChild(script);
}

var acpbundle = localData.get('bundle.js');
var acptimestamp = new Date(parseInt(localData.get('timestamp')));
if(acptimestamp!='Invalid Date' && acptimestamp>new Date() && acpbundle) {
    fillScript(acpbundle);
    console.log('We just read bundle.js from Localstorage...');
} else {
    loadXMLDoc('/dist/bundle.js');
}