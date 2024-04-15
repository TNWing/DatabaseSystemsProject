/*
change the code to send the server requests
*/

const availableSpecies=[];
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
    if (type=="Species"){
        //if ()
    }
    //then, show breeds based on species filter
    //each species shoudl
    updatePage();
}

function resetFilters(){
    filterMap.clear();
    updatePage();
}

function updatePage(){
    var cond="";
    var speciesArr=filterMap.get('Species');
    if (speciesArr.length>0){
        var speciesList=arrToList(speciesArr);
        cond=condBuilder(cond,`species IN ${speciesList}`)

    }
    //var breedArr=filterMap.get('Breed');
    //var breedList=arrToList(breedArr);
    var filterQuery="SELECT * FROM Pets";
    if (cond!=""){
        filterQuery='SELECT * FROM Pets where ' + cond;
    }
    console.log(filterQuery);
    sqlResults(filterQuery).then(
        results=>{
            console.log(results);
        }
    );
}
/*
fetches all pet species from species table, then adds them to the hover list
*/
async function getSpecies(){
    if (availableSpecies.length==0){
        var query="SELECT * FROM Species";
        sqlResults(query).then(
                results=>{
                    console.log(results);
                    //availableSpecies=results;
                }
            );
    }
    let container=document.getElementById("species_child_container");
    container.innerHTML='';
    for (let i=0;i<availableSpecies.length;i++){
        /*
        <div class="hover_child_container" id="species_child_container">
                        <div class= "hover_child" onclick="setFilters('Species','Dog')">Dog</div>
                        <div class= "hover_child" onclick="setFilters('Species','Cat')">Cat</div>
                        <div class= "hover_child" onclick="setFilters('Species','Rabbit')">Rabbit</div>
                        <div class= "hover_child" onclick="setFilters('Species','Guinea Pigs')">Guinea Pig</div>
                    </div>
        */
        let speciesEle=document.createElement("div");
        speciesEle.onclick=function(){
            setFilters('Species',availableSpecies[i]);
        }
        speciesEle.innerHTML=availableSpecies[i];
        container.appendChild(speciesEle);

    }
}

function condBuilder(condString,strToAdd,operator="AND"){
    console.log(strToAdd);
    if (condString==""){
        condString=strToAdd;
    }
    else{
        condString+=" " + operator + " "+strToAdd;
    }
    console.log(condString);
    return condString;
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
//also, make species like breed, where the listed species fetch from DB
function toggleBreed(on){
    if (on){
        var speciesList=arrToList(filterMap.get("Species"))

    }
}
/*
filters work as such
if a filter category has no filters enabled, it doesn't filter at all
else, it filters to only allowed selected children
*/
//breeds html element should have a format like so:
/*
Breed
    Dog Breeds
        Beagle
        Husky
    Cat Breeds
        Calico
*/
/*
a breed of a given species is only shown in the following conditions
-no species are filtered
-if a species is filtered, then it shows the breeds of selected species
https://www.w3schools.com/jsref/event_onmouseover.asp
*/
function addEventListeners(){
    var fBreed=document.getElementById("filter_breed");
    fBreed.addEventListener("mouseover",function(){toggleBreed(true)});
    //fBreed.addEventListener("mouseout",toggleBreed(false));
    var fSpecies=document.getElementById("filter_species");
    fSpecies.addEventListener("mouseover",function(){getSpecies()});
}

initMap();
updatePage();
window.onload=function(){
    addEventListeners();
}