  const templates = {
      home: /*html*/
          `<div id="home"> 
            <!-- Cards con los partidos de la semana. Fecha,hora, equipos y estadio. -->
            <div class= "container py-3 home-container">
              <h2 class= "titulo-matches text-center">
                  Next Matches
              </h2>
                <div class="card my-5 text-center" 
                    v-for='match in nextMatches(date.getMonth() + 1, date.getDate())'>
                    <div class= "card-header text-light py-2">
                      <h3>
                          {{match.date}} <br>
                          {{match.time}}
                      </h3>
                    </div>
                    <div class= "card-body">
                      <h4 class= "py-3">
                          {{match.team1}} vs {{match.team2}}
                      </h4>  
                      <h5>
                          <i class="fa fa-map-marker fa-sm text-danger mx-1"></i>
                          {{match.location}}
                      </h5>
                    </div>
                </div>
            </div> <!-- fin container -->
          </div>`,
      schedule: /*html*/
          `<div id="schedule">
              <!-- Lista con todos los partidos -->
              <!-- Selección que muestra información adicional y comentarios. MatchInfo -->
              <template v-if="showInfo">
                  <div class= "container py-3 comments-container ">
                      <button 
                          type= "button" 
                          class= "btn btn-sm btn-dark rounded-circle" 
                          @click="showInfo = false">
                          <i class= "fa fa-chevron-circle-left icon-arrow fa-2x"></i>
                      </button>
                      <match-info :match="match" :user="user"></match-info>
      	        </div>    
              </template>
                  <!-- Muestra listas de todos los partidos -->
                  <template v-else>
                      <div class= "container py-3 schedule-container">
                          <h2 class= "titulo-schedule text-center">
                              NYSL Schedule
                          </h2>
                          <ul class= "list-group">
                              <li class= "list-group-item d-flex justify-content-around my-3" 
                                  v-for="match in matches">
                                  <span class= "date-span1">
                                      {{match.date}}
                                  </span> 
                                  <span class="team-span">
                                      {{match.team1}} vs {{match.team2}}
                                  </span>
                                  <button 
                                      class="btn btn-comment1 rounded-circle text-light" 
                                      @click="matchInfo(match)">
                                      <i class= "fa fa-comments-o fa-md"></i>
                                  </button>
                              </li>
                          </ul>
                      </div>
                  </template>
                  
              </div>`,
      events: /*html*/
            `<div id="events">
              <!-- Botón desplegable para Próximos eventos  -->
              <div class= "container text-center eventos-container">
                  <h2 class= "titulo-eventos py-5">
                    Upcoming Events
                    </h2>
                  <div class= "eventos my-3 py-4">
                      <h3>August 4</h3>
                      <p>NYSL Fundraiser</p>
                  </div>
                  <div class= "eventos my-3 py-4">
                      <h3>August 16</h3>
                      <p>Season Kick-off: Meet the Teams</p>
                  </div>                
                  <div class= "eventos my-3 py-4">
                      <h3>September 1</h3>
                      <p>First Game of the Season <br>(Check Game Schedule for details)</p>
                  </div>    
              </div>
              </div>`,
      contact: /*html*/
          `<div id="contact">
            <div class= "container justify=content-center py-3 contacto-container">
                <p class= "texto-contacto">
                  Hi! Please email us at 
                    <a href="mailto:nysl@chisoccer.org">nysl@chisoccer.org</a>
                </p>
                <div class="form-group">
                    <label for="comment">
                      or leave a comment:
                    </label>
                    <textarea 
                      class="form-control area-contacto py-4" 
                      rows="5" 
                      id="comment">
                    </textarea>
                    <button 
                      type="button" 
                      class= "btn btn-submit btn-md text-light float-right my-3">
                        Submit
                    </button>
                </div>
            </div>    
              </div>`,
      matchInfo: /*html*/
            `<div>
              <!-- Card con información del partido y espacio para comentar el partido -->                  
              <div class="card text-center my-5">
                <div class= "card-header text-light">
                  <h3>
                    {{match.date}} <br> 
                    {{match.time}}
                  </h3>
                </div>
                <div class= "card-body">
                  <h4 class= "py-3">
                    {{match.team1}} vs {{match.team2}}
                  </h4>
                  <h5>
                    {{match.location}}
                  </h5>	
                </div>
              </div>
              <!-- Comentarios del partido -->
              <div class="forum">
                <div class= "container py-3 forum-container">
                  <div 
                    class="commentBubble text-light my-2 px-2 py-1" 
                    v-for="(value,key) in comments">
                      <p>{{value.username}}:</p>
                      <p>{{value.post}}</p>
                  </div>
                  <div class= " my-4 comment-input">
                      <input type="text" id="comment" class= "form-group"><br>
                      <button 
                        type= "button" 
                        class= "btn btn-comment2 btn-sm text-light rounded-circle float-right mx-1 my-2" 
                        @click="comment(match.id)">
                          <i class= "fa fa-comment-o fa-2x"></i>
                      </button>
                  </div>
                </div>
              </div>
            </div>`
  }


  let app = new Vue({
      el: '#app',
      data: {
          view : 'home',
          links: false,
          schedule: {},
          user: 'guest',
      },
      methods: {
          login(){
              /* función autenticación en google a través de firebase */
              let provider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(provider)
              .then(function(result){
                  
                  /* Función que trae los datos de la base de firebase */
                  firebase.database().ref('schedule/').once('value')
                  .then(function(snapshot){
                      app.schedule = snapshot.val()
                      app.user = result.user
                  })
              })
              .catch(function(error){
                  console.log(error)
              })
          },
          logout(){
              firebase.auth().signOut()
              .then(function(){
                  app.user = 'guest'
                  app.schedule = {}
              })
          }
      },
      components: {
          home: {
              props: ['user'],
              data: function(){
                  return {
                      date: new Date()
                  }
              },
              methods: {
                  nextMatches(month, day){
                      let nextMatches = []

                      for(let i = 0; i < 7; i++){
                          let temp = 0

                          if(day + i > 31){
                              day = 0
                              month++
                              temp = i - 1
                          }

                          if(app.schedule[month][day + i - temp]){
                              for(match in app.schedule[month][day + i]){
                                  nextMatches.push(app.schedule[month][day + i][match])
                              }
                          }
                      }
                      return nextMatches
                  }
              },
              template: templates.home
          },
          schedule: {
              props: ['user'],
              data: function(){
                  return{
                      showInfo: false,
                      match: {}
                  }
              },
              methods:{
                  matchInfo(match){
                      this.showInfo = true
                      this.match = match
                  }
              },
              computed:{
                  matches(){
                    let matches = []

                    for(month in app.schedule){
                      for(date in app.schedule[month]){
                          for(match in app.schedule[month][date]){
                              matches.push(app.schedule[month][date][match])
                          }
                      }
                    }
                    return matches
                  }
              },
              template: templates.schedule,
              components: {
                  'match-info': {
                      props: ['user','match'],
                      data:function(){
                          return {
                              comments: []
                          }
                      },
                      created(){
                          this.getComments(this.match.id)
                      },
                      methods: {
                           getComments(matchId){
                              let self = this

                              firebase.database().ref(`forum/${matchId}`)
                              .on('child_added', function(snapshot){
                                  self.comments.push(snapshot.val())           
                              })

                          },
                          comment(matchId){
                              let input = document.getElementById('comment')
                              let newKey = firebase.database().ref(`forum/${matchId}/`).push().key
                              let update = {}
                              update[`forum/${matchId}/${newKey}`] = {
                                  uid: this.user.uid,
                                  username: this.user.displayName,
                                  email: this.user.email,
                                  post: input.value,
                                  match: this.match.id
                              }

                              firebase.database().ref().update(update)

                              input.value = ""
                          }
                      },
                      template: templates.matchInfo
                  }
              }
          },
          events: {
              props: ['user'],
              template: templates.events
          },
          contact: {
              props: ['user'],
              template: templates.contact
          }
      }
  })




  /* Top navigation. Desplegar menu links / bar icon */
  function myFunction() {
      var x = document.getElementById("myLinks");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }


  /* Función para botón scroll-up */
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtn").style.display = "block";
      } else {
          document.getElementById("myBtn").style.display = "none";
      }
    }

  function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }