import React,{useState, useEffect} from 'react';
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Link } from 'react-router-dom'

function App() {
const PORT= 5273;
const [hasFetched, setHasFetched] = useState(false);
const [isInit,setInit]=useState(false);
  const [isOpen, setIsOpen] = useState(false);

const [petResult, setPets] = useState(null); // Initialize results with sqlResults()
const [availableSpecies, setAvailableSpecies] = useState([]);
const [filterMap,setFilterMap]=useState(new Map());
const [breedMap,setBreedMap]=useState(new Map());
const [user, setUser] = useState(null);

  useEffect(() => {
   var url="http://"+ window.location.hostname + ":"+PORT +'/get-user';
   console.log("GETTNG USER");
    fetch(url, {
                   method:"GET",
                  credentials: 'include'
               })
      .then(response => response.json())
      .then(data => setUser(data.user.username));
  }, []);
 const [petElements, setPetElements] = useState(null);

 async function initMap(){
    let tempMap=new Map();
    tempMap.set('Species',[]);
    tempMap.set('Breeds',[]);
    setFilterMap(tempMap);

 }
 useEffect(() => {
     const fetchDataAndThenGetSpecies = async () => {
         await fetchData();
         await getSpecies();
         await initMap();
         if (availableSpecies.length>0){
             await getSpecies();
         }
     };
     fetchDataAndThenGetSpecies();
 }, []); // This effect runs once on mount
useEffect(() => {
    if (petResult) {
    console.log("WHY IS THIS CALLED");
        updatePets();
    }
}, [petResult]); // This effect runs when petResult is updated
useEffect(() => {

    updateAdoptionFilters();
}, [filterMap]); // This effect runs when petResult is updated
    async function fetchData() {
        let queryResults=await sqlResults("SELECT * FROM Pets");
        console.log(JSON.parse(queryResults));
        setPets(JSON.parse(queryResults))
    }
    async function updatePets(){

        if (petResult){
            console.log(petResult);
            const result = await processResults(petResult);
                setPetElements(result);

        }
    }
    if (!petElements) {
        return <div>Loading...</div>; // Or some loading spinner
    }

/*
filter map key_values
Species->array of species to include, if empty, then include all
Breeds->array of breeds to include. must use the breedMap to see if any breeds of that species is filtered
*/

const filterEnabled=false;
async function sqlResults(sqlQuery) {
    var url="http://"+ window.location.hostname + ":"+PORT +'/select';
    console.log(sqlQuery +" is our query");
    const response = await fetch(url, {
        method:"POST",

credentials: 'include',
        headers: {
              'Content-Type': 'text/plain'
            },
        body:sqlQuery
    })
    let results = await response.text();
    return results;
}


  const openFilters = () => {
    setIsOpen(!isOpen);
  };
  function arrToList(arr){
      let list= arr.map(function (a) {
          return "'" + a.replace("'", "''") + "'";
      }).join(', ');
      return "(" + list + ")";
  }
  async function adoptAttempt(id){
    let query="SELECT * FROM Users Join Adopt On Adopt.userid=Users.userid Join Pets On Pets.petid=Adopt.petid WHERE Users.email='"+user+"' AND Pets.petid='" +id+"'" ;
    let results=JSON.parse(await sqlResults(query));
    console.log(results);
    console.log(results.length);
    if (results.length>0){//if pet application exists already
        alert("You already filed an application for this pet!");
    }
    else{
        query="SELECT userid FROM Users where email='"+user+"'";
        let userID=JSON.parse(await sqlResults(query));
        userID=userID[0][0];
        console.log(userID);
            var url="http://"+ window.location.hostname + ":"+PORT +'/adoptApplication';
            var bodyJSON={user:userID,pet:id};
            var bodyStr=JSON.stringify(bodyJSON);
            const response = await fetch(url, {
                method:"POST",
                credentials: 'include',
                headers: {
                      'Content-Type': 'text/plain'
                    },
                body:bodyStr
            });
            let results = await response.text();
            console.log(results);
            if (results=='OK'){
                alert("Application fulfilled!");
            }
            else{
                alert("Error! Please try again.");
            }

    }
  }

  //processes the results from a query and makes new elements for each pet that was filtered
async function processResults(results){
    return new Promise((resolve, reject) => {
        try {
            let processedResults = results.map((result, index) => {
                //TODO
                return (
                    <div key={index}>{result[1]}
                        <img></img>
                        <button disabled={user? false:true} onClick={()=>adoptAttempt(result[0])}>Adopt!</button>
                        <br />
                    </div>

                );
            });
            resolve(processedResults);
        } catch (error) {
            reject(error);
        }
    });
}
  /*
  CURRENTLY NO RELATION BTWN PET IMAGES AND PETS SO WILL ADD TO QUERIES LATER
   PetImage_Belongs
  */
  async function updateAdoptionFilters(){
      var cond="";
      var speciesArr=filterMap.get('Species');
      var conds=[];
      var petArr=[];
      /*
      setPets(JSON.parse(queryResults))
      */
      console.log(filterMap);
      if (filterMap.has('Species') && speciesArr.length>0){

          for(let i=0;i<speciesArr.length;i++){
          var query="";
            var breedArr=[];
            let sB=breedMap.get(speciesArr[i]);
            console.log("HEY OUR SB IS " + sB);
            if (sB.length>0){
                let noBreedRestrict=true;
                for (let b=0;b<sB.length;b++){
                    var bool=filterMap.get('Breeds').includes(sB[b]);
                    if(bool){
                        noBreedRestrict=false;
                        breedArr.push(sB[b]);
                    }
                }

                if (noBreedRestrict){
                    console.log("NO BREED FILTER");
                    // SELECT * FROM Pets INNER JOIN Breed_Species_Relationship ON Pets.petID=Breed_Species_Relationship.petID INNER JOIN Species On Species.speciesID=Breed_Species_Relationship.speciesID
                    console.log(speciesArr[i]);
                    query="SELECT * FROM Pets INNER JOIN Breed_Species_Relationship ON Pets.petID=Breed_Species_Relationship.petID INNER JOIN Species On Species.speciesID=Breed_Species_Relationship.speciesID WHERE Species.sname ='" + speciesArr[i]+"'";
                }
                else{
                    console.log("BREED FILTER");
                    query="  SELECT * FROM Pets "
                    +"INNER JOIN Is_Breed_Type ON Pets.petID=Is_Breed_Type.petID INNER JOIN Breed ON Is_Breed_Type.breedID = Breed.breedID "
                    //+"INNER JOIN Breed On PetImage_Belongs.imageid=Breed.breedID "
                    +"where Bname IN " + arrToList(breedArr);
                }
            }
            else{
                console.log("NO BREEDS AT ALL");
                query="SELECT * FROM Pets INNER JOIN Breed_Species_Relationship ON Pets.petID=Breed_Species_Relationship.petID INNER JOIN Species On Species.speciesID=Breed_Species_Relationship.speciesID WHERE Species.sname ='" + speciesArr[i]+"'";

                //may need to flatten/iterate thr the results to append to my petArr
            }
            await sqlResults(query).then(results => {
                let resultsArr = JSON.parse(results);
                resultsArr.forEach(subArr => {
                    petArr.push(subArr);
                });
            });
          }

      }
      else{
        var  query="SELECT * FROM Pets";
         await sqlResults(query).then(results => {
                        let resultsArr = JSON.parse(results);
                        resultsArr.forEach(subArr => {
                            petArr.push(subArr);
                        });
                    });
      }
      setPets(petArr);
  }

async function setFilters(type,filterName){
    console.log("FILTER TYPE,Name" + type +","+ filterName);
    let tempMap=new Map(filterMap);
    if (tempMap.get(type).find((element) => element==filterName)){
        let index=tempMap.get(type).indexOf(filterName)
        tempMap.get(type).splice(index, 1);
        if (type=="Species"){
            //remove any breeds associated with that filter
        }
    }
    else{
        tempMap.get(type).push(filterName);
    }

    setFilterMap(tempMap);

    //then, show breeds based on species filter
    //each species shoudl
    //updateAdoptionFilters();
}

async function resetFilters(){
    //filterMap.clear();
    await initMap();
    //updateAdoptionFilters();
}


  async function flattenArr(arrToConvert){
    let result=[];
    for (let i=0;i<arrToConvert.length;i++){
        result.push(arrToConvert[i][0]);
    }
    return result;
  }
  async function getSpecies() {
        console.log(availableSpecies.length);
       if (availableSpecies.length === 0) {
           var query = "SELECT sname FROM Species";
           const results = await sqlResults(query);
           const species = await flattenArr(JSON.parse(results));
           setAvailableSpecies(species);;
           console.log(filterMap.get('Species'));
           let tempMap=new Map(breedMap);
           //for each species, load the breeds for each
           for (let i=0;i<species.length;i++){

            var breeds=await getBreeds(species[i]);
            tempMap.set(species[i],breeds);
           }
           setBreedMap(tempMap);
       }
   };

 async function getBreeds(speciesName) {
    var query=`SELECT Bname FROM Breed_Species_Relationship,Breed,Species WHERE Breed_Species_Relationship.breedID = Breed.breedID AND  Breed_Species_Relationship.speciesID = Species.speciesIDSpecies.sname=${speciesName}`;
    query=`SELECT Breed.Bname from Breed Join Breed_Species_Relationship on Breed.breedID=Breed_Species_Relationship.breedID join Species on Species.speciesID=Breed_Species_Relationship.speciesID WHERE Species.Sname='${speciesName}'`;
     var results = await sqlResults(query);
     var breeds = await flattenArr(JSON.parse(results));
     return breeds;
 };

  return (
    <div>
      <header data-bs-theme="dark">
        <Navbar/>
      </header>
      <main>
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 1"/>
              <div className="container">
                <div className="carousel-caption text-start transparent-bg">
                  <h1>Bringing joy.</h1>
                  <p className="opacity-75">Join us in our mission to bring joy into the lives of pets and people alike, one adoption at a time.</p>
                  <p><Link className="btn btn-lg btn-primary" href="#">Adopt</Link></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 2"/>
              <div className="container">
                <div className="carousel-caption transparent-bg">
                  <h1>Finding family.</h1>
                  <p>Together, we make tails wag as we unite pets with their forever families, spreading happiness and love.</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Donate</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="src/images/petImage3.jpeg" className="d-block w-100" alt="Slide 3"/>
              <div className="container">
                <div className="carousel-caption text-end transparent-bg">
                  <h1>Transforming lives.</h1>
                  <p>From shelter to forever family, we're dedicated to guiding pets on their journey to finding lasting love and companionship.</p>
                  <p><Link className="btn btn-lg btn-primary" href="/resources">Resources</Link></p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="container marketing">
          <div className="team-heading-container">
            <h2 className="fw-normal">Meet the team</h2>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Dante Amicarella</h2>
              <p>Dante's bio and role in the team.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Jessilyn Collette</h2>
              <p>Jess's bio and role in the team.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Trevor Ng</h2>
              <p>Trevor's bio and role in the team.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
          </div>
        </div>

            <div className="filter_parent" onClick={()=>openFilters()}>Filters

                </div>
{isOpen && (<div className="filter_body" id="filter_body">
                                            <div className="hover_parent" id="filter_species" style={{height: '200px' ,width:'450px',maxHeight: '150px', overflowY: 'scroll' }}>
                                                Species
                                                        <div className="hover_child_container" id="species_child_container">
                                                            {availableSpecies.map((species, i) => (
                                                                <div key={i} onClick={(e) => { console.log(e.target);console.log(e.currentTarget);if (e.target === e.currentTarget) setFilters('Species', species);}}>
                                                                    {species}
                                                                    <br/>
                                                                        <div className="filter_type hover_parent2" id="filter_breed">
                                                                       {breedMap.has(species) && breedMap.get(species).length>0 &&  filterMap.get('Species').includes(species) &&(
                                                                           <React.Fragment>
                                                                            <div style={{width: '300px' ,maxHeight: '100px', overflowY: 'scroll' }}>
                                                                               <div>Breeds</div>
                                                                               {breedMap.get(species).map((item, index) => (

                                                                                   <React.Fragment key={index}>
                                                                                       <div style={{ marginLeft:'15px',marginBottom: '7px' }} onClick={(e) => {e.preventDefault();  e.stopPropagation(); setFilters('Breeds', item);}}>
                                                                                           {item}
                                                                                       </div>

                                                                                   </React.Fragment>
                                                                               ))}
                                                                               </div>
                                                                           </React.Fragment>
                                                                       )}

                                                                        </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                            </div>

                                        </div>
                                    )}


<div id="petsToShow">
{petElements}
</div>

        <div>
          {/* Start Featurettes */}
          <hr className="featurette-divider" />
          
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">Learn about your pet. <span className="text-body-secondary">It’ll blow your mind.</span></h2>
              <p className="lead">Find out what your pet needs to eat in order to be the best version of itself.</p>
            </div>
            <div className="col-md-5">
              <img src="src/images/petImage4.png" alt="Featurette Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="800" height="1200" href="#"/>
            </div>

          </div>

          <hr className="featurette-divider" />

          <div className="row featurette">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading fw-normal lh-1">We find the cutest pets. <span className="text-body-secondary">See for yourself.</span></h2>
              <p className="lead">We have a wide variety of pets all with different personalities and characteristics. Every pet is unique in its own way. </p>
            </div>
            <div className="col-md-5 order-md-1">
              <img src="src/images/petImages5.webp" alt="Featurette Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="800" height="800" href="#"/>
            </div>
          </div>

          <hr className="featurette-divider" />

          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">Apply for adoption. <span className="text-body-secondary">Checkmate.</span></h2>
              <p className="lead">Once you have fallen in love with one of our pets apply for adoption, our dedicated team will start working extremely hard to ensure the process is smooth and transparent.</p>
            </div>
            <div className="col-md-5">
              <img src="src/images/petImages6.png" alt="Featurette Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="800" height="1200" href="#"/>
            </div>
          </div>

          <hr className="featurette-divider" />
          {/* End Featurettes */}
        </div>
        <Footer/>
      </main>
    </div>
  );
}
export default App;

/* <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form> */
