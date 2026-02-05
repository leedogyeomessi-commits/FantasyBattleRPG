// =======================
// 직업 9개
// =======================
const jobs = {
  warrior:{name:"전사",hp:150,atk:14,skill:2},
  knight:{name:"기사",hp:170,atk:11,skill:1.6},
  berserker:{name:"광전사",hp:130,atk:20,skill:3},

  mage:{name:"마법사",hp:90,atk:26,skill:3},
  sorcerer:{name:"주술사",hp:100,atk:22,skill:2.5},
  necromancer:{name:"강령술사",hp:95,atk:24,skill:2.8},

  rogue:{name:"도적",hp:105,atk:18,skill:2},
  archer:{name:"궁수",hp:110,atk:17,skill:2},
  monk:{name:"수도사",hp:130,atk:16,skill:1.8}
};

// =======================
const monsters = [
  {name:"고블린",hp:60,atk:8,exp:20},
  {name:"오크",hp:110,atk:14,exp:40},
  {name:"트롤",hp:170,atk:18,exp:70}
];

let player={}, monster={}, skillCooldown=0;

// =======================
// 직업 버튼
// =======================
const jobsDiv=document.getElementById("jobs");
for(let k in jobs){
  const b=document.createElement("button");
  b.innerText=jobs[k].name;
  b.onclick=()=>selectJob(k);
  jobsDiv.appendChild(b);
}

// =======================
function selectJob(key){
  const j=jobs[key];
  player={
    name:j.name,
    maxHp:j.hp,
    hp:j.hp,
    atk:j.atk,
    skill:j.skill,
    level:1,
    exp:0
  };
  document.getElementById("job-select").style.display="none";
  document.getElementById("game").style.display="block";
  spawnMonster();
  updateUI();
}

// =======================
function spawnMonster(){
  monster=JSON.parse(JSON.stringify(
    monsters[Math.floor(Math.random()*monsters.length)]
  ));
  log(`야생의 ${monster.name} 등장!`);
}

// =======================
// 전투 + 연출
// =======================
function attack(){
  const p=document.getElementById("player");
  const m=document.getElementById("monster");

  p.classList.add("attack");
  setTimeout(()=>p.classList.remove("attack"),200);

  monster.hp-=player.atk;

  m.classList.add("hit","shake");
  setTimeout(()=>m.classList.remove("hit","shake"),300);

  if(monster.hp>0){
    player.hp-=monster.atk;
  } else win();

  checkDeath();
  updateUI();
}

function useSkill(){
  if(skillCooldown>0){log("스킬 쿨타임");return;}
  const m=document.getElementById("monster");

  monster.hp-=Math.floor(player.atk*player.skill);
  skillCooldown=3;

  m.classList.add("hit","shake");
  setTimeout(()=>m.classList.remove("hit","shake"),400);

  log("강력한 스킬!");
  if(monster.hp<=0) win();
  updateUI();
}

function win(){
  log(`${monster.name} 처치!`);
  gainExp(monster.exp);
  spawnMonster();
}

function pvp(){
  const enemyAtk=Math.floor(Math.random()*25)+10;
  log("PVP 전투!");
  if(player.atk>enemyAtk){
    log("PVP 승리!");
    gainExp(30);
  }else{
    log("PVP 패배...");
    player.hp-=25;
  }
  checkDeath();
  updateUI();
}

// =======================
function gainExp(exp){
  player.exp+=exp;
  if(player.exp>=player.level*50){
    player.exp=0;
    player.level++;
    player.maxHp+=12;
    player.atk+=2;
    player.hp=player.maxHp;
    log(`레벨 업! Lv.${player.level}`);
  }
}

function checkDeath(){
  if(player.hp<=0){
    alert("사망했습니다.");
    location.reload();
  }
}

function updateUI(){
  document.getElementById("player-info").innerText=
    `${player.name} Lv.${player.level} HP ${player.hp}/${player.maxHp}`;
  document.getElementById("monster-info").innerText=
    `${monster.name} HP ${monster.hp}`;
  if(skillCooldown>0) skillCooldown--;
}

function log(t){
  document.getElementById("log").innerText=t;
}
