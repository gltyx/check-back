var autosaveStarted = false
//Sets all variables to their base values
function reset() {
	game = {
    XP: 0,
    level: 1,
    buttonCooldowns: [0, 0, 0, 0, 0, 0],
    unlocks: 0,
    currentTheme: 2,
    lastSave: Date.now(),
    timeOfLastUpdate: Date.now(),
    pets: [],
    specialPets: [],
    selectedPet: 0,
    dailyRewards: 0,
  }
}
reset()

//If the user confirms the hard reset, resets all variables, saves and refreshes the page
function hardReset() {
  if (confirm("Are you sure you want to reset? You will lose everything!")) {
    reset()
    save()
    location.reload()
  }
}

function save() {
  //console.log("saving")
  game.lastSave = Date.now();
  localStorage.setItem("checkBackSave", JSON.stringify(game));
}

function setAutoSave() {
  setInterval(save, 5000);
  autosaveStarted = true;
}
//setInterval(save, 5000)

function load() {
	reset()
	let loadgame = JSON.parse(localStorage.getItem("checkBackSave"))
	if (loadgame != null) {loadGame(loadgame)}
  updateSmall()
}

load()

function exportGame() {
  save()
  navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function() {
    alert("Copied to clipboard!")
  }, function() {
    alert("Error copying to clipboard, try again...")
  });
}

function importGame() {
  loadgame = JSON.parse(atob(prompt("Input your save here:")))
  if (loadgame && loadgame != null && loadgame != "") {
    reset()
    loadGame(loadgame)
    save()
    location.reload()
  }
  else {
    alert("Invalid input.")
  }
}

function loadGame(loadgame) {
  //Sets each variable in 'game' to the equivalent variable in 'loadgame' (the saved file)
  let loadKeys = Object.keys(loadgame);
  for (i=0; i<loadKeys.length; i++) {
    if (loadgame[loadKeys[i]] != "undefined") {
      let thisKey = loadKeys[i];
      if (Array.isArray(loadgame[thisKey])) {
        game[loadKeys[i]] = loadgame[thisKey].map((x) => {return x})
      }
      //else {game[Object.keys(game)[i]] = loadgame[loadKeys[i]]}
      else {game[loadKeys[i]] = loadgame[loadKeys[i]]}
    }
  }

  if (game.selectedPet==0) {
    document.getElementById("selectedPet").innerHTML = "None"
    document.getElementById("selectedPetImg").style.display = "none"
  }
  else if (game.selectedPet<pets.length) {
    document.getElementById("selectedPet").innerHTML = pets[game.selectedPet][0]
    document.getElementById("selectedPetImg").style.display = "inline-block"
    document.getElementById("selectedPetImg").src = "img/pets/" + game.selectedPet + ".png"
  }
  else {
    document.getElementById("selectedPet").innerHTML = specialPets[game.selectedPet-pets.length][0]
    document.getElementById("selectedPetImg").style.display = "inline-block"
    document.getElementById("selectedPetImg").src = "img/pets/S" + [game.selectedPet-pets.length] + ".png"
  }

  changeTheme(game.currentTheme)
  if (game.unlocks >= 1) {document.getElementById("button2").style.display = "block"}
  if (game.unlocks >= 2) {document.getElementById("button3").style.display = "block"}
  if (game.unlocks >= 3) {document.getElementById("button4").style.display = "block"}
  if (game.unlocks >= 4) {document.getElementsByClassName("themeButton")[2].style.display = "inline-block"}
  if (game.unlocks >= 5) {document.getElementById("button5").style.display = "block"}
  if (game.unlocks >= 6) {
    document.getElementById("unboxButton1").style.display = "block"
    document.getElementById("selectedPetText").style.display = "block"
    document.getElementById("petsTabButton").style.display = "block"
    document.getElementById("dailyRewardButton").style.display = "block"
  }
  if (game.unlocks >= 7) {document.getElementById("unboxButton2").style.display = "block"}
  if (game.unlocks >= 8) {
    document.getElementsByClassName("themeButton")[3].style.display = "inline-block"
    document.getElementsByClassName("themeButton")[4].style.display = "inline-block"
    document.getElementsByClassName("themeButton")[5].style.display = "inline-block"
  }
  if (game.unlocks >= 9) {document.getElementById("unboxButton3").style.display = "block"}
}


//Updates variables and text
function updateSmall() {
  //Sets whether the buttons are disabled or not
  //These could definitely be condensed into one thing!
  if (game.buttonCooldowns[0] > 0) {
    document.getElementById("button1").disabled = true
    document.getElementById("button1").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[0])
  }
  else {
    document.getElementById("button1").disabled = false
    if (game.selectedPet < pets.length) {document.getElementById("button1").innerHTML = "Gain " + (pets[game.selectedPet][1]).toFixed(2) + " XP"}
    else {document.getElementById("button1").innerHTML = "Gain " + (specialPets[game.selectedPet - pets.length][1]).toFixed(2) + " XP"}
  }
  if (game.buttonCooldowns[1] > 0) {
    document.getElementById("button2").disabled = true
    document.getElementById("button2").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[1])
  }
  else {
    document.getElementById("button2").disabled = false
    if (game.selectedPet < pets.length) {document.getElementById("button2").innerHTML = "Gain " + (2 * pets[game.selectedPet][1]).toFixed(2) + " XP"}
    else {document.getElementById("button2").innerHTML = "Gain " + (2 * specialPets[game.selectedPet - pets.length][1]).toFixed(2) + " XP"}
  }
  if (game.buttonCooldowns[2] > 0) {
    document.getElementById("button3").disabled = true
    document.getElementById("button3").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[2])
  }
  else {
    document.getElementById("button3").disabled = false
    if (game.selectedPet < pets.length) {document.getElementById("button3").innerHTML = "Gain " + (5 * pets[game.selectedPet][1]).toFixed(2) + " XP"}
    else {document.getElementById("button3").innerHTML = "Gain " + (5 * specialPets[game.selectedPet - pets.length][1]).toFixed(2) + " XP"}
  }
  if (game.buttonCooldowns[3] > 0) {
    document.getElementById("button4").disabled = true
    document.getElementById("button4").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[3])
  }
  else {
    document.getElementById("button4").disabled = false
    if (game.selectedPet < pets.length) {document.getElementById("button4").innerHTML = "Gain " + (10 * pets[game.selectedPet][1]).toFixed(2) + " XP"}
    else {document.getElementById("button4").innerHTML = "Gain " + (10 * specialPets[game.selectedPet - pets.length][1]).toFixed(2) + " XP"}
  }
  if (game.buttonCooldowns[4] > 0) {
    document.getElementById("button5").disabled = true
    document.getElementById("button5").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[4])
  }
  else {
    document.getElementById("button5").disabled = false
    if (game.selectedPet < pets.length) {document.getElementById("button5").innerHTML = "Gain " + (25 * pets[game.selectedPet][1]).toFixed(2) + " XP"}
    else {document.getElementById("button5").innerHTML = "Gain " + (25 * specialPets[game.selectedPet - pets.length][1]).toFixed(2) + " XP"}
  }
  if (game.buttonCooldowns[5] > 0) {
    document.getElementById("unboxButton1").disabled = true
    document.getElementById("unboxButton1").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[5])
  }
  else {
    document.getElementById("unboxButton1").disabled = false
    document.getElementById("unboxButton1").innerHTML = "Unbox a random basic pet"
  }
  if (game.buttonCooldowns[6] > 0) {
    document.getElementById("unboxButton2").disabled = true
    document.getElementById("unboxButton2").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[6])
  }
  else {
    document.getElementById("unboxButton2").disabled = false
    document.getElementById("unboxButton2").innerHTML = "Unbox a random advanced pet"
  }
  if (game.buttonCooldowns[7] > 0) {
    document.getElementById("unboxButton3").disabled = true
    document.getElementById("unboxButton3").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[7])
  }
  else {
    document.getElementById("unboxButton3").disabled = false
    document.getElementById("unboxButton3").innerHTML = "Unbox a random epic pet"
  }
  if (game.buttonCooldowns[8] > 0) {
    document.getElementById("claimDailyRewardButton").disabled = true
    document.getElementById("claimDailyRewardButton").innerHTML = "Check back in " + numberToTime(game.buttonCooldowns[8])
    document.getElementById("dailyRewardButton").style.border = "0.3vh solid #80f"
  }
  else {
    document.getElementById("claimDailyRewardButton").disabled = false
    document.getElementById("claimDailyRewardButton").innerHTML = "Claim daily reward"
    if (Date.now() % 600 < 300) {document.getElementById("dailyRewardButton").style.border = "0.3vh solid #80f"}
    else {document.getElementById("dailyRewardButton").style.border = "0.3vh solid #d9f"}
  }
  game.level = XPToLevel(Math.max(Math.floor(game.XP), 0))
  document.getElementById("level").innerHTML = game.level
  //This bit is weird and gross
  //Sets the colour of the level bar, the texture of the level bar (if you're a high enough level), and your rank name
  i=0
  while (game.level >= levelBarColours[i+1][0]) i++
  document.getElementById("levelBar").style.backgroundColor = levelBarColours[i][1]
  if (game.level >= levelBarTextures[0]) {
    i=0
    while (game.level >= levelBarTextures[i]) i++
    document.getElementById("levelBar").style.backgroundImage = "url('img/texture" + i + ".png')"
    document.getElementById("levelBarText").style.textShadow = "0.3vh 0.3vh rgba(0,0,0,0.6)"
    document.getElementById("levelBarRankText").style.textShadow = "0.3vh 0.3vh rgba(0,0,0,0.6)"
  }
  i=0
  while (game.level >= ranks[i+1][0]) i++
  document.getElementById("rank").innerHTML= ranks[i][1]
  //Sets the "XP to next level" text
  XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
  ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
  document.getElementById("XPToNextlevel").innerHTML = ProgressToNextLevel + "/" + XPToNextLevel
  document.getElementById("XPBarBack").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%"
  handleUnlocks()
}
setInterval(updateSmall, 16) //Runs the update ~60 times per second

//Updates cooldowns
function updateLarge() {
  for (i=0;i<9;i++) {
    if (game.buttonCooldowns[i] > 0) game.buttonCooldowns[i] -= ((Date.now() - game.timeOfLastUpdate) / 1000)
    if (game.buttonCooldowns[i] < 0) game.buttonCooldowns[i] = 0
  }
  game.timeOfLastUpdate = Date.now()
}
setInterval(updateLarge, 100) //Runs the update ~10 times per second

function XPToLevel(x) {return Math.floor((x / 5) ** 0.6) + 1}
function levelToXP(x) {return Math.ceil((x-1) ** (1/0.6) * 5)}
function numberToTime(x) {
  xCeil = Math.ceil(x)
  result = ""
  if (xCeil>=7200) result += Math.floor(xCeil/3600) + " hours "
  else if (xCeil>=3600) result += Math.floor(xCeil/3600) + " hour "
  if (Math.floor(xCeil/60)%60 == 1) result += (Math.floor(xCeil/60)%60) + " minute "
  else if (Math.floor(xCeil/60)%60 != 0) result += (Math.floor(xCeil/60)%60) + " minutes "
  if (xCeil%60 == 1) result += Math.floor(xCeil%60) + " second "
  else if (xCeil%60 != 0) result += Math.floor(xCeil%60) + " seconds "
  return result
}

//Handles clicking the buttons
function clickButton(x) {
  if (x==1 && game.buttonCooldowns[0] == 0) {
    if (game.selectedPet < pets.length) {
      game.XP += (pets[game.selectedPet][1])
      game.buttonCooldowns[0] = 60 / (pets[game.selectedPet][3]) //1 minute
    } 
    else {
      game.XP += (specialPets[game.selectedPet - pets.length][1])
      game.buttonCooldowns[0] = 60 / (specialPets[game.selectedPet - pets.length][3]) //1 minute
    } 
  }
  else if (x==2 && game.buttonCooldowns[1] == 0) {
    if (game.selectedPet < pets.length) {
      game.XP += (2 * pets[game.selectedPet][1])
      game.buttonCooldowns[1] = 600 / (pets[game.selectedPet][3]) //10 minutes
    } 
    else {
      game.XP += (2 * specialPets[game.selectedPet - pets.length][1])
      game.buttonCooldowns[1] = 600 / (specialPets[game.selectedPet - pets.length][3]) //10 minutes
    } 
  }
  else if (x==3 && game.buttonCooldowns[2] == 0) {
    if (game.selectedPet < pets.length) {
      game.XP += (5 * pets[game.selectedPet][1])
      game.buttonCooldowns[2] = 3600 / (pets[game.selectedPet][3]) //1 hour
    } 
    else {
      game.XP += (5 * specialPets[game.selectedPet - pets.length][1])
      game.buttonCooldowns[2] = 3600 / (specialPets[game.selectedPet - pets.length][3]) //1 hour
    } 
  }
  else if (x==4 && game.buttonCooldowns[3] == 0) {
    if (game.selectedPet < pets.length) {
      game.XP += (10 * pets[game.selectedPet][2])
      game.buttonCooldowns[3] = 21600 / (pets[game.selectedPet][3]) //6 hours
    } 
    else {
      game.XP += (10 * specialPets[game.selectedPet - pets.length][2])
      game.buttonCooldowns[3] = 21600 / (specialPets[game.selectedPet - pets.length][3]) //6 hours
    } 
  }
  else if (x==5 && game.buttonCooldowns[4] == 0) {
    if (game.selectedPet < pets.length) {
      game.XP += (25 * pets[game.selectedPet][2])
      game.buttonCooldowns[4] = 86400 / (pets[game.selectedPet][3]) //24 hours
    } 
    else {
      game.XP += (25 * specialPets[game.selectedPet - pets.length][2])
      game.buttonCooldowns[4] = 86400 / (specialPets[game.selectedPet - pets.length][3]) //624 hours
    } 
  }
  updateSmall()
}

//Handles unlocks (Happens 60 times a second, could definitely be optimised!)
function handleUnlocks() {
  for (i=0;i<unlockLevels.length;i++) {
    if (game.level >= unlockLevels[i] && game.unlocks < i+1) {
      game.unlocks = i+1
      //Could probably use a switch
      if (i==0) {document.getElementById("button2").style.display = "block"}
      else if (i==1) {document.getElementById("button3").style.display = "block"}
      else if (i==2) {document.getElementById("button4").style.display = "block"}
      else if (i==3) {document.getElementsByClassName("themeButton")[2].style.display = "inline-block"}
      else if (i==4) {document.getElementById("button5").style.display = "block"}
      else if (i==5) {
        document.getElementById("unboxButton1").style.display = "block"
        document.getElementById("selectedPetText").style.display = "block"
        document.getElementById("petsTabButton").style.display = "block"
        document.getElementById("dailyRewardButton").style.display = "block"
      }
      else if (i==6) {document.getElementById("unboxButton2").style.display = "block"}
      else if (i==7) {
        document.getElementsByClassName("themeButton")[3].style.display = "inline-block"
        document.getElementsByClassName("themeButton")[4].style.display = "inline-block"
        document.getElementsByClassName("themeButton")[5].style.display = "inline-block"
      }
      else if (i==8) {document.getElementById("unboxButton3").style.display = "block"}
      break
    }
  }
  if (game.unlocks == unlockLevels.length) {document.getElementById("nextUnlockLevel").innerHTML = "All unlocks have been achieved!"}
  else {document.getElementById("nextUnlockLevel").innerHTML = "You will unlock something new at level " + unlockLevels[game.unlocks] + "!"}
}

function unboxPet(x) {
  totalWeight = 0
  //Determines the total weight, and then progressively checks random odds until a pet is found
  //These could all probably be condensed into one but I'm lazy
  if (x==1) {
    for (i=0;i<basicUnboxChances.length;i++) totalWeight += basicUnboxChances[i][1]
    for (i=0;i<basicUnboxChances.length;i++) {
      if (Math.random() * totalWeight < basicUnboxChances[i][1]) {
        petChosen = basicUnboxChances[i][0]
        i = basicUnboxChances.length
      }
      else {
        totalWeight -= basicUnboxChances[i][1]
      }
    }
  }
  else if (x==2) {
    for (i=0;i<advancedUnboxChances.length;i++) totalWeight += advancedUnboxChances[i][1]
    for (i=0;i<advancedUnboxChances.length;i++) {
      if (Math.random() * totalWeight < advancedUnboxChances[i][1]) {
        petChosen = advancedUnboxChances[i][0]
        i = advancedUnboxChances.length
      }
      else {
        totalWeight -= advancedUnboxChances[i][1]
      }
    }
  }
  else if (x==3) {
    for (i=0;i<epicUnboxChances.length;i++) totalWeight += epicUnboxChances[i][1]
    for (i=0;i<epicUnboxChances.length;i++) {
      if (Math.random() * totalWeight < epicUnboxChances[i][1]) {
        petChosen = epicUnboxChances[i][0]
        i = epicUnboxChances.length
      }
      else {
        totalWeight -= epicUnboxChances[i][1]
      }
    }
  }
  else if (x==4) {
    for (i=0;i<skeletalUnboxChances.length;i++) totalWeight += skeletalUnboxChances[i][1]
    for (i=0;i<skeletalUnboxChances.length;i++) {
      if (Math.random() * totalWeight < skeletalUnboxChances[i][1]) {
        petChosen = skeletalUnboxChances[i][0]
        i = skeletalUnboxChances.length
      }
      else {
        totalWeight -= skeletalUnboxChances[i][1]
      }
    }
  }
  else if (x==5) {
    for (i=0;i<ghostUnboxChances.length;i++) totalWeight += ghostUnboxChances[i][1]
    for (i=0;i<ghostUnboxChances.length;i++) {
      if (Math.random() * totalWeight < ghostUnboxChances[i][1]) {
        petChosen = ghostUnboxChances[i][0]
        i = ghostUnboxChances.length
      }
      else {
        totalWeight -= ghostUnboxChances[i][1]
      }
    }
  }
  
  if (x <= 3) {
    alert("Got a " + pets[petChosen][0] + "!")
    if (!game.pets[petChosen]) {game.pets[petChosen] = 1}
    else {game.pets[petChosen]++}
  }
  else {
    alert("Got a " + specialPets[petChosen][0] + "!")
    if (!game.specialPets[petChosen]) {game.specialPets[petChosen] = 1}
    else {game.specialPets[petChosen]++}
  }

  if (game.selectedPet < pets.length) {
    if (x==1) {game.buttonCooldowns[5] = 7200 / (pets[game.selectedPet][4])} //2 hours
    else if (x==2) {game.buttonCooldowns[6] = 21600 / (pets[game.selectedPet][4])} //6 hours
    else if (x==3) {game.buttonCooldowns[7] = 64800 / (pets[game.selectedPet][4])} //18 hours
  }
  else {
    if (x==1) {game.buttonCooldowns[5] = 7200 / (specialPets[game.selectedPet - pets.length][4])} //2 hours
    else if (x==2) {game.buttonCooldowns[6] = 21600 / (specialPets[game.selectedPet - pets.length][4])} //6 hours
    else if (x==3) {game.buttonCooldowns[7] = 64800 / (specialPets[game.selectedPet - pets.length][4])} //18 hours
  }
  
  if (document.getElementById("petsDiv").style.display == "block") displayPets()
}

function displayPetRarities(x) {
  if (x==0) {document.getElementById("petRarities").innerHTML = ""}
  else if (x==1) {
    document.getElementById("petRarities").innerHTML = "<img src='img/crateBasic.png' style='width:6vh'><br><b>Rarities for this crate:</b><br>"
    totalWeight = 0
    for (i=0;i<basicUnboxChances.length;i++) totalWeight += basicUnboxChances[i][1]
    for(i=0;i<basicUnboxChances.length;i++) {
      document.getElementById("petRarities").innerHTML += pets[basicUnboxChances[i][0]][0] + ": " + (basicUnboxChances[i][1] / totalWeight * 100).toFixed(2) + "%<br>"
    }
  }
  else if (x==2) {
    document.getElementById("petRarities").innerHTML = "<img src='img/crateAdvanced.png' style='width:6vh'><br><b>Rarities for this crate:</b><br>"
    totalWeight = 0
    for (i=0;i<advancedUnboxChances.length;i++) totalWeight += advancedUnboxChances[i][1]
    for(i=0;i<advancedUnboxChances.length;i++) {
      document.getElementById("petRarities").innerHTML += pets[advancedUnboxChances[i][0]][0] + ": " + (advancedUnboxChances[i][1] / totalWeight * 100).toFixed(2) + "%<br>"
    }
  }
  else if (x==3) {
    document.getElementById("petRarities").innerHTML = "<img src='img/crateEpic.png' style='width:6vh'><br><b>Rarities for this crate:</b><br>"
    totalWeight = 0
    for (i=0;i<epicUnboxChances.length;i++) totalWeight += epicUnboxChances[i][1]
    for(i=0;i<epicUnboxChances.length;i++) {
      document.getElementById("petRarities").innerHTML += pets[epicUnboxChances[i][0]][0] + ": " + (epicUnboxChances[i][1] / totalWeight * 100).toFixed(2) + "%<br>"
    }
  }
}

function openClosePetsTab() {
  if (document.getElementById("petsDiv").style.display == "block") {
    document.getElementById("petsDiv").style.display = "none"
    document.getElementById("petsListInner").innerHTML = ""
  }
  else {
    document.getElementById("petsDiv").style.display = "block"
    displayPets()
  }
}

//Adds the squares for all the pets to the pets tab
function displayPets() {
  document.getElementById("petsListInner").innerHTML = ""
  let petBox = document.createElement("div")
  petBox.style.display = "inline-block"
  petBox.style.position = "relative"
  petBox.style.width = "128px"
  petBox.style.height = "128px"
  petBox.style.margin = "8px 0 0 8px"
  petBox.style.border = "8px solid black"
  petBox.style.cursor = "pointer"
  petBox.style.backgroundColor = "#888"
  petBox.style.backgroundImage = "url('img/halftoneDots.png')"
  petBox.className += "petBox"
  petBoxes = document.getElementsByClassName("petBox");
  for (i=1;i<pets.length;i++) {
    document.getElementById("petsListInner").appendChild(petBox.cloneNode(true))
    petBoxes[i-1].setAttribute("id", i)
    petBoxes[i-1].addEventListener('click', function(){
      if (game.pets[parseInt(this.id)] > 0) {setSelectedPet(parseInt(this.id))}
    })
    petBoxes[i-1].addEventListener('mouseover', function(){
      if (game.pets[parseInt(this.id)] > 0) {showPetInfo(parseInt(this.id))}
    })
    petBoxes[i-1].addEventListener('mouseout', function(){showPetInfo(0)})
    if (game.pets[i] > 0) {
      petBoxes[i-1].innerHTML = "<img src='img/pets/" + i + ".png' style='width: 128px'>"
      petBoxes[i-1].innerHTML += "<p style='position: absolute; top: 0; left: 0; margin: 2px; color: white; font-size: 24px'>" + game.pets[i] + "</p>"
      if (i<=6) petBoxes[i-1].style.border = "8px outset #555"
      else if (i<=13) petBoxes[i-1].style.border = "8px outset #447"
      else if (i<=22) petBoxes[i-1].style.border = "8px outset #647"
    }
    else {
      petBoxes[i-1].innerHTML = "<img src='img/pets/" + i + ".png' style='width: 128px; filter: brightness(0)'>"
      petBoxes[i-1].innerHTML += "<p style='position: absolute; top: 0; left: 0; margin: 2px; color: white; font-size: 24px'>0</p>"
    }
  }
  j=pets.length-1
  for (i=pets.length;i<specialPets.length + pets.length;i++) {
    if (game.specialPets[i - pets.length] > 0) {
      j++
      document.getElementById("petsListInner").appendChild(petBox.cloneNode(true))
      petBoxes[j-1].setAttribute("id", i)
      petBoxes[j-1].addEventListener('click', function(){
        setSelectedPet(parseInt(this.id))
      })
      petBoxes[j-1].addEventListener('mouseover', function(){
        showPetInfo(parseInt(this.id))
      })
      petBoxes[j-1].addEventListener('mouseout', function(){showPetInfo(0)})
      petBoxes[j-1].innerHTML = "<img src='img/pets/S" + (i-pets.length) + ".png' style='width: 128px'>"
      petBoxes[j-1].innerHTML += "<p style='position: absolute; top: 0; left: 0; margin: 2px; color: white; font-size: 24px'>" + game.specialPets[i-pets.length] + "</p>"
      if (i-pets.length<=8) petBoxes[j-1].style.border = "8px outset #bbb"
      else if (i-pets.length<=16) petBoxes[j-1].style.border = "8px outset #282"
    }
  }
}

function showPetInfo(x) {
  if (x==0) {document.getElementById("petInfo").innerHTML = ""}
  else if (x<pets.length) {
    document.getElementById("petInfo").innerHTML = "<br><br><center><p style='color: white'><span style='font-size: 32px; font-weight: bold'>" + pets[x][0] + "</span><br>You have " + game.pets[x] + "</p><br><img src='img/pets/" + x + ".png' style='width: 50%'><br><p style='color: white'><span style='font-size: 32px; font-weight: bold'>Effects:</span><br>+" + ((pets[x][1] - 1) * 100).toFixed(1) + "% XP for buttons 1-3<br>+" + ((pets[x][2] - 1) * 100).toFixed(1) + "% XP for buttons 4-5<br>-" + ((1 - (1 / pets[x][3])) * 100).toFixed(1) + "% XP button cooldown<br>-" + ((1 - (1 / pets[x][4])) * 100).toFixed(1) + "% pet button cooldown</p></center>"
  }
  else {
    document.getElementById("petInfo").innerHTML = "<br><br><center><p style='color: white'><span style='font-size: 32px; font-weight: bold'>" + specialPets[x-pets.length][0] + "</span><br>You have " + game.specialPets[x-pets.length] + "</p><br><img src='img/pets/S" + [x-pets.length] + ".png' style='width: 50%'><br><p style='color: white'><span style='font-size: 32px; font-weight: bold'>Effects:</span><br>+" + ((specialPets[x-pets.length][1] - 1) * 100).toFixed(1) + "% XP for buttons 1-3<br>+" + ((specialPets[x-pets.length][2] - 1) * 100).toFixed(1) + "% XP for buttons 4-5<br>-" + ((1 - (1 / specialPets[x-pets.length][3])) * 100).toFixed(1) + "% XP button cooldown<br>-" + ((1 - (1 / specialPets[x-pets.length][4])) * 100).toFixed(1) + "% pet button cooldown</p></center>"
  }
}

function setSelectedPet(x) {
  game.selectedPet = x
  if (x==0) {
    document.getElementById("selectedPet").innerHTML = "None"
    document.getElementById("selectedPetImg").style.display = "none"
  }
  else if (x<pets.length) {
    document.getElementById("selectedPet").innerHTML = pets[x][0]
    document.getElementById("selectedPetImg").style.display = "inline-block"
    document.getElementById("selectedPetImg").src = "img/pets/" + x + ".png"
  }
  else {
    document.getElementById("selectedPet").innerHTML = specialPets[x-pets.length][0]
    document.getElementById("selectedPetImg").style.display = "inline-block"
    document.getElementById("selectedPetImg").src = "img/pets/S" + [x-pets.length] + ".png"
  }
}

function openCloseDailyRewardTab() {
  if (document.getElementById("dailyRewardDiv").style.display == "block") {
    document.getElementById("dailyRewardDiv").style.display = "none"
  }
  else {
    document.getElementById("dailyRewardDiv").style.display = "block"
    displayDailyRewards()
  }
}

function displayDailyRewards() {
  for (i=0;i<4;i++) {
    dailyRewardDay = game.dailyRewards+i+1
    document.getElementsByClassName("dayBox")[i].innerHTML = "Day " + dailyRewardDay
    if (dailyRewardDay % 2 == 1) {document.getElementsByClassName("dayBox")[i].innerHTML += "<br><br>" + Math.min(17.5 + dailyRewardDay * 2.5, 100) + " XP"}
    else if (dailyRewardDay % 4 == 2) {document.getElementsByClassName("dayBox")[i].innerHTML += "<span style='font-size: 1.5vh'><br>Skeletal crate</span><br><img src='img/crateSkeletal.png' style='width:4vh; margin: 0; margin-top: 1vh;'>"}
    else {document.getElementsByClassName("dayBox")[i].innerHTML += "<span style='font-size: 1.5vh'><br>Ghost crate</span><br><img src='img/crateGhost.png' style='width:4vh; margin: 0; margin-top: 1vh;'>"}
  }
}

function displayDailyRewardRarities(x) {
  if (x==0) {document.getElementById("dailyRewardRarities").innerHTML = ""}
  else if ((x+game.dailyRewards) % 4 == 2) {
    document.getElementById("dailyRewardRarities").innerHTML = "<img src='img/crateSkeletal.png' style='width:6vh'><br><b>Rarities for this crate:</b><br>"
    totalWeight = 0
    for (i=0;i<skeletalUnboxChances.length;i++) totalWeight += skeletalUnboxChances[i][1]
    for(i=0;i<skeletalUnboxChances.length;i++) {
      document.getElementById("dailyRewardRarities").innerHTML += specialPets[skeletalUnboxChances[i][0]][0] + ": " + (skeletalUnboxChances[i][1] / totalWeight * 100).toFixed(2) + "%<br>"
    }
  }
  else if ((x+game.dailyRewards) % 4 == 0) {
    document.getElementById("dailyRewardRarities").innerHTML = "<img src='img/crateGhost.png' style='width:6vh'><br><b>Rarities for this crate:</b><br>"
    totalWeight = 0
    for (i=0;i<ghostUnboxChances.length;i++) totalWeight += ghostUnboxChances[i][1]
    for(i=0;i<ghostUnboxChances.length;i++) {
      document.getElementById("dailyRewardRarities").innerHTML += specialPets[ghostUnboxChances[i][0]][0] + ": " + (ghostUnboxChances[i][1] / totalWeight * 100).toFixed(2) + "%<br>"
    }
  }
  else {document.getElementById("dailyRewardRarities").innerHTML = ""}
}

function claimDailyReward() {
  game.buttonCooldowns[8] = 86400 //24 hours
  game.dailyRewards++
  displayDailyRewards()
  if (game.dailyRewards % 2 == 1) {game.XP += Math.min(17.5 + game.dailyRewards * 2.5, 100)}
  else if (dailyRewardDay % 4 == 2) {unboxPet(4)}
  else {unboxPet(5)}
}

function changeTheme(x) {
  game.currentTheme = x
  if (x==1) {document.getElementById("themeLink").href = "themes/themeLight.css"}
  else if (x==2) {document.getElementById("themeLink").href = "themes/themeDark.css"}
  else if (x==3) {document.getElementById("themeLink").href = "themes/themeNeon.css"}
  else if (x==4) {document.getElementById("themeLink").href = "themes/themeGreen.css"}
  else if (x==5) {document.getElementById("themeLink").href = "themes/themePurple.css"}
  else if (x==6) {document.getElementById("themeLink").href = "themes/themeRed.css"}
}