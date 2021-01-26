// Запрос на получение данных
function httpRequest(url){
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener('load', () => {
      if(Math.floor(xhr.status / 100) !==2) {
        outErrRes(`Error, Status code ${xhr.status}`, xhr);
        return;
      }
      const response = JSON.parse(xhr.responseText);
      outErrRes(null, response);
    });

    xhr.addEventListener('error', () => outErrRes(`Error, Status code: ${xhr.status}`, xhr));

    xhr.send();
  } catch (error) {
    outErrRes(error);
  }
}

// функция при получение результата запроса
let outErrRes = (error, response) => {
  if(error){
    console.log(error);
  }
  insertData(response);
  localStorage.data = JSON.stringify(response);
  console.log(response);
}

// Получаем данные из localStorage или запросом
if(!localStorage.data){
  httpRequest("http://demo.sibers.com/users");
}

else{
  insertData(JSON.parse(localStorage.data));
}


// функция вставки всех данных
function insertData(data){
  data.forEach(element => {
    insertCard(element);
  });
}



// функция вставки одного элемента
function insertCard({name, phone, email, id}){
  let temp = document.querySelector("template");
  temp.content.querySelector(".name").innerHTML = name;
  temp.content.querySelector(".tel").innerHTML = phone;
  temp.content.querySelector(".email").innerHTML = email;
  temp.content.querySelector(".card").setAttribute('id_card', id);;
  let clone = document.importNode(temp.content, true);
  document.querySelector(".wrapper").appendChild(clone);
  addDetail(document.querySelector(".wrapper").lastElementChild, id);
}


let popup = document.querySelector(".popup-bacground");
// если клик сделан не на карточке, то она закрывается
popup.addEventListener("click", function(event){ 
  if (event.target.id == "popup-bacground") {
    this.style.display = "none"
  }
});

// Добавление подробной информации о контакте в виде всплявающей карточки
function addDetail(item, idCard){
  item.addEventListener("click", function(){
    let data = JSON.parse(localStorage.data);
  let card = data.find(({id})=>{
    if(id == idCard) {
      return true
    }
    else return false
  })

    popup.querySelector(".name").innerHTML = card.name;
    popup.querySelector(".tel").innerHTML = card.phone;
    popup.querySelector(".email").innerHTML = card.email;
    //popup.querySelector(".id").innerHTML = card.id;
    popup.querySelector(".country").innerHTML = card.address.country;
    popup.querySelector(".city").innerHTML = card.address.city;
    
    popup.querySelector(".popup").setAttribute("id_card", card.id);


    console.log(card);
    popup.style.display = "flex"; 

  })
}

// Кнопка для редактирования содержимого
popup.querySelector(".edit").addEventListener("click", function(){
  popup.querySelector(".name").contentEditable = 'true';
  popup.querySelector(".tel").contentEditable = 'true';
  popup.querySelector(".email").contentEditable = 'true';
  popup.querySelector(".country").contentEditable = 'true';
  popup.querySelector(".city").contentEditable = 'true';
  
})


// Кнопка для сохранения отредактированного результата
popup.querySelector(".save").addEventListener("click", function(){

  popup.querySelector(".name").contentEditable = 'false';
  popup.querySelector(".tel").contentEditable = 'false';
  popup.querySelector(".email").contentEditable = 'false';

  let idCard = popup.querySelector(".popup").getAttribute("id_card");
  let card = document.querySelector(`[id_card = '${idCard}']`);
  let name = popup.querySelector(".name").innerHTML;
  let tel = popup.querySelector(".tel").innerHTML;
  let email = popup.querySelector(".email").innerHTML;

  card.querySelector(".name").innerHTML =  name;
  card.querySelector(".tel").innerHTML = tel;
  card.querySelector(".email").innerHTML =  email;
  popup.style.display = "none";

  saveInLocalstorage(idCard, {name, tel, email});

})

// Функция сохранения в localStorage
function saveInLocalstorage(idCard, {name, tel, email}){
  let data = JSON.parse(localStorage.data);
  let card = data.find(({id})=>{
    if(id == idCard) {
      return true
    }
    else return false
  })
  let modСard = card;
  modСard.name = name;
  modСard.phone = tel;
  modСard.email = email;
  data.splice(data.indexOf(card), 1, modСard);
  localStorage.data = JSON.stringify(data);
}


searchBtn = document.querySelector("#searchBtn");
// Реализация функционала поиска
searchBtn.addEventListener("click", () => {
  document.querySelector(".wrapper").innerHTML = "";
  searchStr = document.querySelector("input[type = 'search']").value;
  if(searchStr){
    data = JSON.parse(localStorage.data);
    data.forEach((item)=>{
      if(~item.name.toUpperCase().indexOf(searchStr.toUpperCase())){
        insertCard(item);
      }
      if(~item.email.toUpperCase().indexOf(searchStr.toUpperCase())){
        insertCard(item);
      }
    });
  }
})
sort = document.querySelector('.selectSort');
// Реализация функционала сортировки
sort.addEventListener('change', ()=>{
  data = JSON.parse(localStorage.data);
 
  data.sort((a, b)=>{
    if(a.name < b.name) {return -1}
    if(a.name > b.name)  {return 1}
    return 0
    
  })

  if(sort.value === "increase"){
    document.querySelector(".wrapper").innerHTML = "";
    insertData(data);
  }

  if(sort.value === "decrease"){
    document.querySelector(".wrapper").innerHTML = "";
    insertData(data.reverse());
  }
  if(sort.value === "default"){
    document.querySelector(".wrapper").innerHTML = "";
    data = JSON.parse(localStorage.data);
    insertData(data);
  }
})


