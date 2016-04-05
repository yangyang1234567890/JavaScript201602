//想要操作谁就先获取谁，一下的获取方法都是表格独有的
var oTab = document.getElementById("tab");
var tHead = oTab.tHead;//表格独有的获取方法
var oThs = tHead.rows[0].cells;//获取表头中的所有列（表头第一行中的所有列）
var tBody = oTab.tBodies[0];//(一个表格中中可以有多个body，但是我们只有一个，也就是获取第一个)
var oRows = tBody.rows;//(表格中body的所有行，因为需要对其排序)



//1、获取后台（userInfo.txt中）数据和解析数据
var jsonData = null;
~function () {
	var xhr = new XMLHttpRequest; //创建一个Ajax对象
	xhr.open("get", "json/userInfo.txt", false); //打开我们需要请求数据的那个文件地址
	xhr.onreadystatechange = function () { //监听请求状态
		if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
			var str = xhr.responseText;//获取到请求的数据（JSON格式的字符串）
			jsonData = utils.formatJSON(str);//把请求来的数据转化为JSONg格式的对象，保存在jsonDate中
		}
	};
	xhr.send(null);
}();

//2、绑定数据
~function () {
	var frg = document.createDocumentFragment();//->创建一个文档碎片用来临时的存储我们创建的tr
	for (var i = 0, len = jsonData.length; i < len; i++) {//循环要绑定的数据
		var curData = jsonData[i];//curDate就是每一个要绑定的数据
		curData["sex"] = curData["sex"] == 0 ? "男" : (curData["sex"] == 1 ? "女" : "未知");

		var oTr = document.createElement("tr");//每循环一次创建一行
		for (var key in curData) {
			var oTd = document.createElement("td");//每一行创建四列
			oTd.innerHTML = curData[key];//四列中的内容添加进去
			oTr.appendChild(oTd);//把列放进行中
		}
		frg.appendChild(oTr);//循环一行，创建一行，放进文档碎片中
	}
	tBody.appendChild(frg);
	frg = null;
}();

//3、实现奇数行和偶数行变颜色
function changeBg() {
	for (var i = 0; i < oRows.length; i++) {
		oRows[i].className = i % 2 === 1 ? "bg" : null;
	}
}
changeBg();


//4、实现多列排序
function sortTab(n) {//n当前点击这一列的索引
	for (var k = 0; k < oThs.length; k++) {//在点击当前列的时候,让其他列的flag都回归初始值-1即可
		k != n ? oThs[k].flag = -1 : null;
	}
	var _this = this;
	_this.flag *= -1;//每一次点击绑定事件，执行sortTab方法，进来乘以-1，实现升降序
	var ary = utils.listToArray(oRows);//调用公共库方法把元素集合类数组转化为数组
	ary.sort(function (a, b) {//数组排序，按照列中的内容进行排序
		var curInn = a.cells[n].innerHTML;//当前行第n列中的内容
		var nexInn = b.cells[n].innerHTML;//下一行中第n列中的内容
		var curInnNum = parseFloat(curInn);
		var nexInnNum = parseFloat(nexInn);
		if (isNaN(curInnNum) || isNaN(nexInnNum)) {
			return (curInn.localeCompare(nexInn)) * _this.flag;
		}
		return (curInnNum - nexInnNum)* _this.flag;
	});
	var frg = document.createDocumentFragment();
	for (var i = 0, len = ary.length; i < len; i++) {//把排好顺序的数组添加到文档碎片
		frg.appendChild(ary[i]);
	}
	tBody.appendChild(frg);//文档碎片添加到页面中的表格，DOM映射机制（页面中的标签和js中获取的元素对象是紧紧绑定在一起的，页面HTML结构改变了，js中不需要重新获取，集合里的内容也会紧跟着改变）所以追加也相当于把之前html结构进行重新调整
	changeBg();//排序完，原来的奇偶行可能会改变，颜色也跟着改变，所以重新执行隔行变色
}

//5、绑定点击事件
for (var i = 0, len = oThs.length; i < len; i++) {
	var curTh = oThs[i];
	if (curTh.className.indexOf("cursor") > -1) {
		curTh.flag = -1;//给当前点击的这一列增加自定义属性flag，存储的值是-1
		curTh.index = i;
		curTh.onclick = function () {
			sortTab.call(this, this.index);
		};
	}
}

//->我们第一次点击年龄,它的flag=1,实现了升序
//->我点击性别,按照性别排,但是年龄那一列乱序了
//->当我在点击年龄,此时应该重新按照升序排列,但是第一次的flag变为了1,点击其他列的时候一直没有改变,一直还是1,导致了在点击的时候是按照降序排列的...


//->记住周老师的一句话:"一个人到底有多牛X，不在乎它工作了多长时间，也不在乎做了多少个牛X轰轰的项目，和学历、年龄没有半毛钱的关系，主要在于他是如何对待每一个项目的，有没有尽自己的最大努力和细心把项目做的接近完美"




