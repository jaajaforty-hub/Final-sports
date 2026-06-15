
async function getData() {
  const result = await fetch("/api/data");
  const data = await result.json();

  const today = new Date().getDay();
  const todayData = data[today]


  // ****************** today field ********************************************

  const todayContainer = document.getElementById("matches-container");

  todayData.forEach(match=>{

  todayContainer.innerHTML += `

  <div class="match-row">

  <div>
  <img src="${match.logo}">
  </div>

  <div>
  ${match.team}
  </div>

  <div>
  ${match.country}
  </div>

  <div>${match.results}</div>

  <div class="odd">
  ${match.odd}
  </div>

  <div>
  ${match.time}
  </div>

  </div>

  `;

  });


  // *************************Tomorrow field *******************************************

  const tomorrowContainer = document.getElementById("tomorrow-container");

  const tomorrow = data[(today + 1)%7] 


  tomorrow.forEach(match=>{
  tomorrowContainer.innerHTML += `
  <div class="tu-match-row">

  <div>
  <img src="${match.logo}">
  </div>

  <div>
  ${match.team}
  </div>

  <div class="odd">
  ${match.odd}
  </div>

  <div>
  ${match.time}
  </div>

  </div>

  `;

  });

    /* **************************UPCOMING ***************************** */

    const upcoming = data[(today + 2) % 7]
 

    const upcomingContainer = document.getElementById("upcoming-container");
    upcoming.forEach(match=>{

    upcomingContainer.innerHTML += `

    <div class="tu-match-row">

    <div>
    <img src="${match.logo}">
    </div>

    <div>
    ${match.team}
    </div>

    <div class="odd">
    ${match.odd}
    </div>

    <div>
    ${match.time}
    </div>

    </div>

    `;

    });
    
}

getData()
















