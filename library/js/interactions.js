//For handling navigation panel animation
$(function() {

    var categoryList = $("#category-list"),
        regexpList = $("#regexp-navigation");

    categoryList.on("click", ".category-item", function() {
        regexpList.css({
            visibility: "visible"
        });

        setTimeout(function() {
            regexpList.addClass("open");
        }, 0);
    });

    $("#close-regex-navigation").click(function() {
        regexpList.removeClass("open");
        setTimeout(function() {
            regexpList.css({
                visibility: "hidden"
            });
        }, 0);
    });

});

(function() {

    var app = window.RegExpDirectory,
        view = app.View,
        directory = null;

    view.loadUI = function() {

        directory = app.Directory;

        view.setCategories();
        view.setCategoryHandler();
        view.setRegExpListHandler();
        view.setRegExpInputHandler();

    };

    //Load categories
    view.setCategories = function() {
        var looper,
            categoryList = $("#category-list");

        categoryList.empty();

        for(looper in directory) {
            $("<li>").addClass("category-item").attr("data-regexpkey", looper).html(directory[looper].displayName).appendTo(categoryList);
        }

        //activeCategory = $(".category-item", categoryList).first().addClass("active").get(0);

    };

    //Event handling for selecting category
    view.setCategoryHandler = function() {
        var regExpList = $("#regexp-list"),
            activeCategoryElement = null;

        $("#category-list").on("click", ".category-item", function() {
            var list = null,
                looper = 0;

            if(this !== activeCategoryElement) {
                $(activeCategoryElement).removeClass("active");
                activeCategoryElement = this;
                $(this).addClass("active");

                view.activeCategory = this.dataset.regexpkey;

                $("#close-regex-navigation").text("< " + directory[view.activeCategory].displayName);

                list = directory[view.activeCategory].list || [];
                regExpList.empty();
                while(looper < list.length) {
                    $("<li>").addClass("regexp-item").attr("data-index", looper).html(list[looper].name).appendTo(regExpList);
                    looper++;
                }

                if(looper === 0) {
                    $("<li>").addClass("no-regexp-item").html("The list is empty").appendTo(regExpList);
                }

            }
        });
    };

    //Event handling for selecting regular expression
    view.setRegExpListHandler = function() {
        var regExpList = $("#regexp-list"),
            activeRegExpElement = null;

        regExpList.on("click", ".regexp-item", function() {
            var list = directory[view.activeCategory].list || [],
                looper = parseInt(this.dataset.index),
                descPanel = $("#description-panel"),
                testPanel = $("#test-inputs"),
                index = 0,
                testItem = null,
                item = null;

            if(!!list && !!list[looper] && activeRegExpElement !== this) {
                item = list[looper];

                $(activeRegExpElement).removeClass("active");
                activeRegExpElement = this;
                $(this).addClass("active");

                $("#regexp-title").text(item.name);

                $("#regexp-pattern").text(item.pattern + item.flags);
                app.currentRegExp = new RegExp(item.pattern, item.flags || "");

                descPanel.empty();
                while(index < item.description.length) {
                    $("<p>").text(item.description[index]).appendTo(descPanel);
                    index++;
                }
                if(index === 0) {
                    $("<p>").text("No description available").appendTo(descPanel);
                }

                index = 0;
                testPanel.empty();
                while(index < item.test.length) {
                    testItem = $("<li>").text(item.test[index]);
                    if(app.currentRegExp.test(item.test[index])) {
                        testItem.addClass("passed");
                    } else {
                        testItem.addClass("failed");
                    }
                    testPanel.append(testItem);
                    index++;
                }

                if(index === 0) {
                    $("<li>").text("Test inputs not available").appendTo(testPanel);
                }
            }

        });
    };

    //Event handling for testing user input against
    //selected expression
    view.setRegExpInputHandler = function() {
        var timer = 0;
        $("#regexp-input").on("change", function() {
            if(app.currentRegExp) {
                if(app.currentRegExp.test($(this).val())) {
                    $("#regexp-input-result").attr("class", "").addClass("passed").html("&#10003;");
                }
                else {
                    $("#regexp-input-result").attr("class", "").addClass("failed").html("&#10007;");
                }
            }
            else if($(this).val().length > 0) {
                clearTimeout(timer);
                $("#regexp-input-error-handler").addClass("active");
                timer = setTimeout(function() {
                    $("#regexp-input-error-handler").removeClass("active");
                }, 2500);
            }
        });
    };

}());