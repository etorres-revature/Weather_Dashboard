const apiKey = "1Y1w9yctnCuWpZljCPIwpQAXB3CLCw7z"
let searchTerms = "";
let numResults = 0;
let beginDate = "1851";
let endDate = "2020";
let queryURLBase = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${apiKey}`;

var articleCounter = 0;

$("#search").on("click", function () {
    event.preventDefault();

    $(".articles").empty();

    searchTerms = $("#inputSearchTerms").val().trim();
    // console.log(searchTerms);
    let searchURL = queryURLBase + "&q=" + searchTerms;
    // console.log(searchURL);
    beginDate = $("#inputStartYear").val().trim();
    endDate = $("#inputEndYear").val().trim();

    if (parseInt(beginDate)) {
        searchURL = queryURLBase + "&begin_date=" + beginDate + "0101";
        console.log(searchURL);
    }

    if (parseInt(endDate)) {
        searchURL = queryURLBase + "&end_date=" + endDate + "1231";
        // console.log(searchURL);
    }

    numResults = $("#inputNumber").val();
    console.log(numResults);

    $.ajax({
        url: searchURL,
        method: "GET"
    })

        .then(function (dataFromNYT) {
            // console.log(dataFromNYT.response.docs[0].abstract);
            // console.log(dataFromNYT.response.docs[0].web_url);
            // console.log(dataFromNYT.response.docs[0].headline.main);
            // let results = response.docs;
            // console.log(results);

            for (var i = 1; i <= numResults; i++) {
                // console.log("in the for loop")
                var articleDiv = $("<div>").addClass("card-body").attr("id", "card-body-" + i).css("list-style-type", "none");

                var headline = dataFromNYT.response.docs[i].headline.main;
                var abstract = dataFromNYT.response.docs[i].abstract;
                var webURL = dataFromNYT.response.docs[i].web_url;
                var pHeadline = $("<h4>").text(headline);
                var aURL = $("<a>").attr("href", webURL).text(webURL)
                var pAbstract = $("<p>").text(abstract);

                // if (headline === null) {
                //     pheadline = $("<hr>").text("No headline available");
                // }

                articleDiv.append(pHeadline);
                articleDiv.append(aURL);
                articleDiv.append(pAbstract);
                articleDiv.append("<hr>");

                $(".articles").append(articleDiv);
            }

            $("#inputSearchTerms").val("");
            $("#inputStartYear").val("");
            $("#inputEndYear").val("");

        });
});

$("#clear").on("click", function(){
event.preventDefault();
$(".articles").empty();
// $("#inputSearchTerms").val("");
// $("#inputStartYear").val("");
// $("#inputEndYear").val("");
})
