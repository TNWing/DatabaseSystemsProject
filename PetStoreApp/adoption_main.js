/*
change the code to send the server requests
*/


const filterMap=new Map();
const filterEnabled=false;
const PORT= 5273;
function arrToList(arr){
    let list= arr.map(function (a) {
        return "'" + a.replace("'", "''") + "'";
    }).join(', ');
    return "(" + list + ")";
}
function initMap(){
    filterMap.set('Species',[]);
}
function switchCollapse(a){
    if (a.style.display == "block") {
        a.style.display = "none";
    }
    else {
      a.style.display = "block";
    }
};
function openFilters(){
    ele=document.getElementById("filter_body");
    if (ele.style.display == "block") {
        ele.style.display = "none";
    }
    else {
      ele.style.display = "block";
    }
}

function setFilters(type,filterName){
    if (filterMap.get(type).find((element) => element==filterName)){
        index=filterMap.get(type).indexOf(filterName)
        filterMap.get(type).splice(index, 1);
    }
    else{
        filterMap.get(type).push(filterName);
    }
    updatePage();
}

function resetFilters(){
    filterMap.clear();
    updatePage();
}

function updatePage(){
    var speciesArr=filterMap.get('Species');
    var speciesList=arrToList(speciesArr);
    var speciesQuery=`SELECT * FROM Pets where species IN ${speciesList}`;
    console.log(speciesQuery);
    console.log(speciesList);
    sqlResults(speciesQuery).then(
        results=>{
            console.log(results);
        }
    );

}

async function sqlResults(sqlQuery) {
    var url="http://"+ window.location.hostname + ":"+PORT +'/select';
    //http://localhost:5173/
    const response = await fetch(url, {
        method:"POST",
        headers: {
              'Content-Type': 'text/plain'
            },
        body:sqlQuery
    })
    let results = await response.text();
    console.log(results);
    return results;
}
initMap();
updatePage();