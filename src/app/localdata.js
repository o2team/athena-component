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