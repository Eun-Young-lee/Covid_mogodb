window.onload = function() {
	getCovidStats();
	getVaccine();
}

function getCovidStats() {
	fetch('https://corona.lmao.ninja/v2/countries/Ireland')
	.then((response) => {
		return response.json();
	})
	.then((data)=> {	
		var d = new Date(data.updated);
		document.getElementById('updated').innerHTML = 'last updated: '+d;
		document.getElementById('cases').innerHTML = data.cases;
		document.getElementById('deaths').innerHTML = data.deaths;	
		document.getElementById('recovered').innerHTML = data.recovered;		
	})
	setTimeout(getCovidStats, 43200000) 
}
function getVaccine() {
	fetch('https://disease.sh/v3/covid-19/vaccine/coverage/countries/Ireland')
	.then((response) => {
		return response.json();
	})
	.then((data)=> {		
		var timeline = data.timeline
		var count =Object.values(timeline).length
		 console.log(count);
		 console.log(Object.values(timeline)[count-1])
		document.getElementById('vaccinated').innerHTML = Object.values(timeline)[count-1];			
})
			
 setTimeout(getVaccine, 43200000) 
}

const pageDown = document.querySelector('.home__move');
const pageBack = document.querySelector('.fa-arrow-left');
const searchSection = document.querySelector('.search');

const Counties = document.querySelector('.search__county');
const CentreName = document.querySelector('.search__centreName');
const searchBtn = document.querySelector('.search__button');
const table = document.querySelector('.search__result');
const mapSection = document.querySelector('.search__map');
const url = `./data/walkin.json`;

let map;

function reloadMap() {
  table.addEventListener('click', (e) => {
    if (e.target.className === 'result__map__link') {
      if (window.innerWidth <= 768) {
        const resultDetail = e.target.parentNode;
        const address = resultDetail.previousSibling;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${address.innerText}`;
        e.target.href = mapUrl;
        Counties.value = '';
        CentreName.value = '';
      } else {
        const currentList = e.target.parentNode;
        const lat = currentList.firstElementChild;
        const lng = lat.nextElementSibling;

        if (e.target.id === currentList.id) {
          const userPosition = {
            lat: parseFloat(lat.innerText),
            lng: parseFloat(lng.innerText),
          };

          map = new google.maps.Map(mapSection, {
            center: userPosition,
            zoom: 15,
          });

          new google.maps.Marker({
            position: userPosition,
            map: map,
          });
        }
      }
    }
  });
}

function makeHTML(result) {
  const li = document.createElement('li');
  const resultAddress = document.createElement('span');
  const resultDetail = document.createElement('div');
  const resultMapLink = document.createElement('a');

  const latitude = document.createElement('span');
  const longitude = document.createElement('span');

  li.classList.add('result__center');
  resultAddress.classList.add('result__address');
  resultDetail.classList.add('result__detail');
  resultMapLink.classList.add('result__map__link');
  latitude.classList.add('coordinates');
  longitude.classList.add('coordinates');

  resultDetail.id = result.id;
  resultMapLink.id = result.id;

  li.innerText = result.centreName;
  resultAddress.innerText = result.address;
  resultMapLink.innerText = 'GoToMap';
  latitude.innerText = result.lat;
  longitude.innerText = result.lng;

  table.appendChild(li);
  li.appendChild(resultAddress);
  li.appendChild(resultDetail);
  resultDetail.appendChild(latitude);
  resultDetail.appendChild(longitude);
  resultDetail.appendChild(resultMapLink);
}

function onSearchBtn(result) {
  searchBtn.addEventListener('click', () => {
    CentreName.disabled = false;
    table.innerHTML = '';
    try {
      for (let i = 0; i < result.length; i++) {
        makeHTML(result[i]);
      }
      table.style.display = 'block';
    } catch {
      alert('Not Found');
    }
  });
}

function filterRegion(arr) {
  Counties.addEventListener('input', (e) => {
    if (Counties.value === '') {
      alert('Select County');
      return;
    }
    const userCounty = e.target.value;
    const countyResult = arr.filter((item) => item.county === userCounty);

    if (userCounty === '') {
      CentreName.disabled = true;
      onSearchBtn(countyResult);
    } else {
      CentreName.disabled = false;
      CentreName.addEventListener('input', (e) => {
        if (CentreName.value === '') {
          alert('Select Clinics');
          return;
        }
        const userCentre = e.target.value;
        const result = countyResult.filter(
          (item) => item.centreName === userCentre
        );
        onSearchBtn(result);
      });
    }
  });
}

function loadData() {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => filterRegion(json.data));
}

function createOption(item) {
  CentreName.innerHTML = `<option value="">Select Clinic</option>`;

  const array = Object.values(item);
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    const option = document.createElement('option');
    option.innerText = array[i];
    option.value = array[i];
    CentreName.appendChild(option);
  }
}

function setForm(data) {
  Counties.addEventListener('input', (e) => {
    if (e.target.value === '') {
      CentreName.innerHTML = '';
      return;
    }

    for (let i = 0; i < Counties.length; i++) {
      if (e.target.value === data[i].county) {
        createOption(data[i]);
        break;
      }
    }
  });
}

function loadCentre() {
  return fetch('./data/data.json')
    .then((response) => response.json())
    .then((json) => setForm(json.details));
}

function init() {
  loadCentre();
  loadData();
  reloadMap();
}

const threadSectionDOM = document.querySelector('.thread-section');

const inputTextDOM = document.getElementById('inputTitle');
const inputContentDOM = document.getElementById('inputContent');
const formDOM = document.querySelector('.form-section');

let inputText = '';
let inputContentText = '';

const getAllThreads = async () => {
  try {
    let allThreads = await axios.get('/api/v1/threads');
    console.log(allThreads);
    let { data } = allThreads;
    console.log(data);

    allThreads = data
      .map((thread) => {
        const { title, content } = thread;
        console.log(title);
        return `<div class="single-thread">
        <h3>${title}</h3>
        <p>${content}</p>
       </div>
      `;
      })
      .join('');
    threadSectionDOM.innerHTML = allThreads;
  } catch (err) {
    console.log(err);
  }
};

getAllThreads();

//POST
inputTextDOM.addEventListener('change', (e) => {
  inputText = e.target.value;
  console.log(inputText);
});
inputContentDOM.addEventListener('change', (e) => {
  inputContentText = e.target.value;
});

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (inputText && inputContentText) {
    console.log('add data');

    try {
      await axios.post('/api/v1/thread', {
        title: inputText,
        content: inputContentText,
      });
      getAllThreads();
      inputTextDOM.value = '';
      inputContentDOM.value = '';
    } catch (err) {
      console.log(err);
    }
  }
});

init();
