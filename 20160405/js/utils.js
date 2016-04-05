var utils = (function () {
    return {
        listToArray: function (likeAry) {
            var ary = [];
            try {
                ary = Array.prototype.slice.call(likeAry, 0);
            } catch (e) {
                for (var i = 0; i < likeAry.length; i++) {
                    ary[ary.length] = likeAry[i];
                }
            }
            return ary;
        },

        formatJSON: function (jsonStr) {
            return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
        }
    }
})();
