import React,{useState, useEffect} from 'react';
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Link } from 'react-router-dom'

function App() {
const PORT= 5273;
const [availableSpecies, setAvailableSpecies] = useState([]);
const filterMap=new Map();
const breedMap=new Map();//to make things a little less confusing
/*
filter map key_values
Species->array of species to include, if empty, then include all
*/
const filterEnabled=false;
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
    return results;
}
  const [isOpen, setIsOpen] = useState(false);

  const openFilters = () => {
    setIsOpen(!isOpen);
  };
  function updateAdoptionFilters(){
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
    updateAdoptionFilters();
}

function resetFilters(){
    filterMap.clear();
    updateAdoptionFilters();
}




  async function flattenArr(arrToConvert){
    let result=[];
    for (let i=0;i<arrToConvert.length;i++){
        result.push(arrToConvert[i][0]);
    }
    return result;
  }
  async function getSpecies() {
       if (availableSpecies.length === 0) {
           var query = "SELECT sname FROM Species";
           const results = await sqlResults(query);
           const species = await flattenArr(JSON.parse(results));
           setAvailableSpecies(species);
           //for each species, load the breeds for each
           for (let i=0;i<species.length;i++){
            var breeds=await getBreeds(species[i]);
            breedMap.(species[i],breeds);
           }
       }
   };

 async function getBreeds(speciesName) {
    var query="SELECT Bname FROM Breed_Species_Relationship,Breed WHERE Breed_Species_Relationship.breedID = Breed.breedID AND Breed.Bname=" + speciesName;
     var results = await sqlResults(query);
     var breeds = await flattenArr(JSON.parse(results));
     return breeds;
 };
 useEffect(() => {

        getSpecies();
    }, [availableSpecies, sqlResults]);

    useEffect(() => {
      getSpecies();
    }, []);
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
                {isOpen && (            <div className="filter_body" id="filter_body">
                                            <div className="filter_type hover_parent" id="filter_species">
                                                Species
                                                        <div id="species_child_container">
                                                            {availableSpecies.map((species, i) => (
                                                                <div key={i} onClick={() => setFilters('Species', species)}>
                                                                    {species}
                                                                        <div className="filter_type hover_parent" id="filter_breed">
                                                                        Breeds
                                                                            {speciesArray.map((item, index) => (
                                                                             <div key={index} onClick={() => setFilters('Breeds', 'name')}>{item} </div>
                                                                            ))}
                                                                        </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                            </div>
                                            <div className="filter_type hover_parent" id="filter_breed">
                                                Breeds
                                                <div className="hover_child_container" id="breed_child_container">

                                                </div>
                                            </div>
                                            <div className="filter_type hover_parent" id="filter_age">
                                                <div id="slider-vertical" style={{height: '200px'}}></div>
                                            </div>
                                        </div>
                                    )}




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
