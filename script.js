// declare variables
// tracking if show results are displayed
var resultsExist = false;
// tracking if show has been selected
var selection = false;
// copy of Json reponse object
// copy used for accessing certain Json object information outside of fetch scope
var jsonObj;
var previousResults = new Array();

// functions
// fetches Json object using tvmaze.com api
// renders shows by passing Json object to renderShows function
function searchShow(showQuery){
  fetch(`https://api.tvmaze.com/search/shows?q=${showQuery}`)
  .then(response => response.json())
  .then(responseJson => displayShows(responseJson))
}

// tracks if form has been submitted
function watchForm(){
  $('form').submit(event => {
    event.preventDefault();
    // remove previous search results if any
    removePreviousResults();
    // get value of submitted text
    let showQuery = $('#show-search').val();
    console.log(showQuery);
    // use value to search for show
    searchShow(showQuery);
    previousResults = [];
  })

}

function handleShowSelection(){
  $('.results-wrapper').on('click', '.show-image', function(event){
    event.preventDefault();
    if(selection === false){
    let showIndex = $(this).attr('id');
    let showDays = jsonObj[showIndex].show.schedule.days.join();
    let showTime = jsonObj[showIndex].show.schedule.time;
    let showSummary = jsonObj[showIndex].show.summary;
    
    if(showDays === null || showDays === "" || showDays === undefined){
      showDays = "Days unavailable";
    }
     if(showTime === null || showTime === "" || showTime === undefined){
      showTime = "Time unavailable";
    }
    if(showSummary === null || showSummary === "" || showSummary === undefined){
      showSummary = "Summary not available";
    }

    console.log(showTime);
    console.log(showDays);

    let httpsUrl;
    let imgUrl;
    console.log(showIndex);
    removePreviousResults();
    if(jsonObj[showIndex].show.image == null){
      httpsUrl = "https://image.shutterstock.com/image-vector/image-unavailable-icon-260nw-1157415967.jpg";
    }
    else{
      imgUrl = jsonObj[showIndex].show.image.medium;
      httpsUrl = imgUrl.replace("http", "https");
    }

     $('.results-wrapper').append(`<img class="selected-show-image" id="${showIndex}" src="${httpsUrl}"alt="${jsonObj[showIndex].show.name}"/>
     <p>${jsonObj[showIndex].show.name}</p>
     <p>Description: ${showSummary}</p>
     <p>Schedule: ${showDays} ${showTime}</p>
     <button>Back</button>`)
      
      selection = true;
    }
  })
}

function displayShows(responseJson){
  console.log(responseJson);
  jsonObj = responseJson;
  for(let i = 0; i < responseJson.length; i++){
   let imgUrl;
   let httpsUrl;
   let imgHtml;

   if (responseJson[i].show.image == null){
    alert('no image found')
    httpsUrl = "https://image.shutterstock.com/image-vector/image-unavailable-icon-260nw-1157415967.jpg";
   }

   else{
    imgUrl = responseJson[i].show.image.medium;
    httpsUrl = imgUrl.replace("http", "https");
   }

    $('.results-wrapper').append(`<img class="show-image" id="${i}" src="${httpsUrl}"alt="${responseJson[i].show.name}"/>
    <p>${responseJson[i].show.name}</p>`)

    imgHtml = $(`#${i}`)[0].outerHTML + `<p>${responseJson[i].show.name}</p>`;
    // don't forget to clear array when results are removed
    previousResults.push(imgHtml);


  }

  resultsExist = true;
  console.log(previousResults);

}

function checkSchedule(showDaysTime){
  if(showDaysTime === null || showDaysTime === "" || showDaysTime === undefined){
      showDaysTime = "Unavailable";
    }
}

function removePreviousResults(){
  if(resultsExist === true || selection === true){
    $('.results-wrapper').empty();
    selection = false;
  }
  resultsExist = false;
}

function watchResultsButton(){
  $('.results-wrapper').on('click', 'button', function(event){
    event.preventDefault();
    $('.results-wrapper').empty();
    let backResults = previousResults.join();
    $('.results-wrapper').append(backResults);
    selection = false;
    resultsExist = true;
  })
}

function handleApp(){
  $(watchForm());
  $(handleShowSelection());
  $(watchResultsButton());
}

$(handleApp())
