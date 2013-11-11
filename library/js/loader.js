(function() {

    var app = RegExpDirectory,
        initCallback = null;


    app.loadDirectory = function(success) {
        initCallback = success;

        $.ajax({
            url: "data/regexpbase.json",
            dataType: "text",
            success: processCategories,
            complete: function() {

            }
        });
    };

    function processCategories(data) {
        app.Directory = data = JSON.parse(data);
        loadExpressions();
    }

    function loadExpressions() {
        var directory = app.Directory,
            key,
            loadCount = 0,
            categoryCount = 0;

        categoryCount = Object.keys(directory).length;

        for(key in directory) {
            $.ajax({
                url: directory[key].path,
                dataType: "text",
                context: directory[key],
                success: populateExpressions,
                complete: completeLoading
            });
        }

        function populateExpressions(data) {
            this.list = JSON.parse(data).list;
        }

        function completeLoading() {
            loadCount++;
            if(loadCount === categoryCount) {
                initCallback();
            }
        }
    }

})();

//Regular expression patttern
/*
    {
        "name": "",
        "pattern": "",
        "mod": "",
        "description": [
            ""
        ],
        "test": [

        ]
    }
*/