ID('all').addEventListener('click', ()=> { todoApp.filter() })
ID('remove').addEventListener('click', ()=> { todoApp.cleanCompleted() })

ID('active').addEventListener('click', ()=> { 
  todoApp.filter('isActive', true)
});
ID('completed').addEventListener('click', () => { 
  todoApp.filter('isActive', false) 
})
ID('search').addEventListener('keydown', (e) => { 
  todoApp.filter('content', e.target.value)
})

const api = {
  data: [
          { id: 1, isActive: false, content: 'done' },
          { id: 2, isActive:  true, content: 'active' }
        ],

  get: function () {
    return new Promise((resolve) => {
      resolve(this.data);
    }, 160);
  },

  set: function () {
    if (this.data.slice(-1)[0].content !== '') {
      this.data.push({
        id: Date.now(),
        isActive: true,
        content: event.target.value,
      });
    } else {
      const idEdit = this.data.slice(-1)[0].id;

      this.data = this.data.map((el) =>
        el.id === idEdit
          ? { id: idEdit, isActive: true, content: ID('textId').value }
          : el
      );

      this.data.pop();
    }

    return new Promise((resolve) => {
      console.log('data:', this.data),
        setTimeout(() => {
          resolve(this.data);
        }, 150);
    });
  },

  toggle: function () {
    this.data.map((el) =>
      el.content === event.target.innerText ? (el.isActive = !el.isActive) : el
    );
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data);
      }, 100);
    });
  },

  search: function (key, value) {
    return new Promise((resolve) => {
      typeof value === 'string' // or boolean
        ? (search = this.data.filter((el) => el[key].indexOf(value) > -1))
        : (search = this.data.filter((el) => el[key] === value));
      resolve(search);
    });
  },

  completed: function () {
    this.data = this.data.filter((el) => {
      return el.isActive === true;
    });
    let l = this.data.length
    if(l===0){
      alert('To Do List is Empty')
      location.reload();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data);
      }, 60);
    });
  },

  edited: function () {
    /*let txt = event.target.previousElementSibling.previousElementSibling.id = Date.now() set id when clicked */
    let dis = document.getElementsByClassName('disabled');
    for (const el of dis) {
      el.setAttribute('disabled', 'true');
      el.style.color = 'gray!important';
      el.style.cursor = 'none';

      setTimeout(()=>{
        el.style.cursor = 'not-allowed';
      },2000)
     
    }

    /*          
                  let x = document.getElementsByClassName("disabled");

                  for (let i=0; i<x.length; i++) {
                      x[i].style.color = "lightgray"; 
                  } 
    */

    let btnEdit = event.target;

    let txt = btnEdit.previousElementSibling.previousElementSibling.innerText; //get text of element clicked

    /*  btnEdit.previousElementSibling.previousElementSibling.setAttribute("class", 'displayNone') */

    let idElementClicked = this.data.find((el) => el.content === txt).id;
     console.log('id of element clicked:', idElementClicked)  

    ID('textId').value = txt; // move the text to input text
    ID('textId').style.border = '2px solid lightblue';
    ID('textId').focus();
    let ind = this.data.findIndex((el) => el.id === idElementClicked);

    /* console.log('index of Element clicked:', ind)  */
    /* this.data.splice(ind,1)                        */
    /* api.set(true, idElementClicked)                */

    this.data.push({ id: idElementClicked, isActive: false, content: '' });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data);
      }, 990000000);
    });
  },

  deleted: function () {
    let txt = event.target.previousElementSibling.innerText;
    let ind = this.data.findIndex((el) => el.content === txt);
    this.data.splice(ind, 1);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data);
      }, 10);
    });
  },
};

class App {
  constructor(lists, left) {
    api.get().then((resolve) => {
      this.data = resolve;
      this.render();
    });
    this.lists = ID(lists);
    this.left = ID(left);
  }

  render() {
    let count = this.data.length; //index
    let listItems = ' ';
    while (count--) {
      listItems += `
       <a class="panel-block disabled ${
         this.data[count].isActive ? '' : 'is-active'
       }" onClick="todoApp.toggle()">
         <span class="panel-icon">  <i class="fa fa-check"></i>  </span>  ${
           this.data[count].content
         }
       </a> 
       <button class="delet disabled" onClick="todoApp.delet()">X</button>
       <button class="edit disabled"  onClick="todoApp.edit()">edit</button> 
     `;
    }
    const list = `
     <input  type="text" 
             class="input-text" 
             placeholder="New todo..." 
             autocomplete="off"
             id='textId'
             onkeydown="javascript: if(event.keyCode == 13){
               todoApp.add(this.value); this.value = null 
             }">

     <div class="list-tasks">${listItems}</div>`;

    this.lists.innerHTML = list;
    this.left.innerHTML = `
   ${this.data.filter((i) => i.isActive === false).length}
   <i class="fa fa-check i"></i>
   `;
  }

  add(value) {
    let empty = ID('textId').value.trim();
    if (empty) {
      this.data.map((el) => el.content).includes(value)
        ? alert('are you repeating the note?')
        : api.set(value).then((resolve) => {
            this.data = resolve;
            this.render(), ID('textId').focus();
          });
    } else {
      alert('Type Something Please');
    }
  }

  toggle() {
    api.toggle().then((resolve) => {
      this.data = resolve;
      this.render();
    });
  }

  filter(key, val) {
    key
      ? api.search(key, val).then((resolve) => {
          this.data = resolve;
          this.render();
        })
      : api.get().then((resolve) => {
          this.data = resolve;
          this.render();
        }); // All
  }

  cleanCompleted() {
    api.completed().then((resolve) => {
      this.data = resolve;
      this.render();
    });
  }

  delet() {
    let l = this.data.length-1
    if(l===0){
      alert('To Do List is Empty')
      location.reload();
    }
    api.deleted().then((resolve) => {
      this.data = resolve;
      this.render();
    });
  }

  edit() {
    api.edited().then((resolve) => {
      this.data = resolve;
      this.render();
    });
  }
}

const todoApp = new App('lists', 'left');
