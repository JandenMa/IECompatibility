/*************************************************
*                                                *
*=================IE兼容共用JS===================*
*                                                *
*=====Refactored by Janden.Ma at 2018-07-13======*
*                                                *
*************************************************/


/*=========== IE 的placeholder层 方法类 开始 =============*/
/*===========Created by Janden.Ma at 2018-07-12===========*/

/**
* @description Placeholder层构造函数
* @param {Object} obj 操作对象
**/
function PlaceholderLayer(obj) {
    this._obj = obj;
};

PlaceholderLayer.prototype = {
    /**@description 光标进入当前控件，隐藏兄弟节点即提示层（克隆节点）**/
    hidePlaceholderLayer: function () {
        this.style.display = '';
        this.nextElementSibling.style.display = 'none';
    },
    /** @description 光标离开当前控件，如果值为空，显示兄弟节点即提示层（克隆节点）**/
    showPlaceholderLayer: function () {
        if (!this.value) {
            this.style.display = 'none';
            this.nextElementSibling.style.display = 'inline';
        }
    },
    /** @description 创建兄弟节点即提示层（克隆节点）**/
    createPlaceholderLayer: function () {
        if (!('placeholder' in document.createElement('input'))) {//如果页面无法创建带有placeholder的input，意味着无法兼容placeholder
            var placeholder = this._obj.getAttribute("placeholder");
            if (placeholder == "") {//控件没有placeholder属性，则不创建克隆节点
                return false;
            } else {
                this._obj.addEventListener('focus', this.hidePlaceholderLayer);
                this._obj.addEventListener('blur', this.showPlaceholderLayer);
                var cloneNode = this._obj.cloneNode(false);//浅度克隆节点（含ID,NAME等）
                cloneNode.removeAttribute("name");//移除克隆节点的name属性，避免submit重复取值 by Janden.Ma
                cloneNode.removeAttribute("id");//移除克隆节点的id属性，一个页面不能有两个相同ID by Janden.Ma
                cloneNode.removeAttribute("placeholder");//移除克隆节点的placeholder属性 by Janden.Ma
                cloneNode.removeAttribute("filename");//移除克隆节点的filename属性,主要针对与表头同页面的表身 by Janden.Ma
                if (this._obj.tagName == "TEXTAREA") {//如果是textarea，则将placeholder赋给克隆节点的值
                    cloneNode.value = placeholder;
                }
                // 如果[type='password']类型，则转为text
                if (cloneNode.getAttribute('type')) {
                    if (cloneNode.getAttribute('type').toLowerCase() === 'password') {
                        cloneNode.setAttribute('type', 'text');
                    }
                }
                cloneNode.setAttribute('value', placeholder);//将placeholder赋给克隆节点的值
                cloneNode.style.display = 'none';//克隆节点初始不显示
                cloneNode.style.color = '#75758b';
                this._obj.insertAdjacentHTML('afterend', cloneNode.outerHTML);//将克隆节点接在控件之后（即成为他的兄弟节点）
                this._obj.nextElementSibling.addEventListener('focus', function () {//光标进入当前控件，隐藏兄弟节点即提示层（克隆节点）
                    this.style.display = 'none';
                    this.previousElementSibling.style.display = 'inline';
                    this.previousElementSibling.focus();
                })
                this.showPlaceholderLayer.apply(this._obj);
            }
        }
    },
    /** @description 移除兄弟节点即提示层（克隆节点）**/
    removePlaceholderLayer: function () {
        this._obj.style.display = '';
        this._obj.parentNode.removeChild(this._obj.nextElementSibling);
        this._obj.removeEventListener('focus', this.hidePlaceholderLayer);
        this._obj.removeEventListener('blur', this.showPlaceholderLayer);
    }
}
/*=========== IE 的placeholder层 方法类 结束 =============*/

/**
* @description 解决Placeholder在IE下的兼容性
**/
function iePlaceholder() {
    if (!('placeholder' in document.createElement('input'))) {//如果页面无法创建带有placeholder的input，意味着无法兼容placeholder
        // 将返回的nodeList对象转为数组
        var nodes = Array.prototype.slice.call(document.querySelectorAll('[placeholder]'));
        for (var i = 0; i < nodes.length; i++) {
            var item = nodes[i];
            var layer = new PlaceholderLayer(item);
            layer.createPlaceholderLayer();
        }
    }

}

/**
* @description 切换IE下显示input控件的placeholder和值
* @param {Object} el 控件元素（不可用JQ取出来的）
**/
function toggleInputPlaceholderAndValue(el) {
    if (!('placeholder' in document.createElement('input'))) {
        if (el) {
            var layer = new PlaceholderLayer(el);
            if (el.value) {
                layer.hidePlaceholderLayer.apply(el);
            } else {
                layer.showPlaceholderLayer.apply(el);
            }
        }
    }
}

/**
* @description 切换IE下移除或创建Placeholder层
* @param {Object} el 控件元素（不可用JQ取出来的）
**/
function togglePlaceholderLayerExist(el) {
    if (!('placeholder' in document.createElement('input'))) {
        if (el) {
            var layer = new PlaceholderLayer(el);
            if (el.getAttribute('placeholder') == '') {
                layer.removePlaceholderLayer();
            } else {
                layer.createPlaceholderLayer();
            }
        }
    }
}

