/*<li class="collection-item">
    <div>
        <span>Task1</span>
        <i class="material-icons secondary-content">delete_forever</i>
        <a href="#modal1" class="modal-trigger secondary-content"><i class="material-icons">edit</i></a> 
    </div>
</li>*/
const lista = document.getElementById('lista-tareas');
const form = document.getElementById('add-tarea-form');
let updateId = null;
const updateBtn = document.getElementById('updateBtn');
let newTitulo = '';



const renderList = (doc)=>{
    let li = document.createElement('li');
    li.className = 'collection-item';
    li.setAttribute('data-id',doc.id);

    let div = document.createElement('div');
    let titulo = document.createElement('span');
    titulo.textContent = doc.data().title;

    let enlace = document.createElement('a');
    enlace.href = '#modal1';
    enlace.className = "modal-trigger secondary-content";

    let editBtn = document.createElement('i');
    editBtn.className = "material-icons";
    editBtn.innerText = "edit";

    let delBtn = document.createElement('i');
    delBtn.className = "material-icons secondary-content"
    delBtn.innerText = "delete_forever"

    enlace.appendChild(editBtn);
    div.appendChild(titulo);
    div.appendChild(delBtn);
    div.appendChild(enlace);
    li.appendChild(div);

    delBtn.addEventListener('click',e=>{
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    })

    editBtn.addEventListener('click',e=>{
        updateId = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
    })

    lista.append(li);
}

updateBtn.addEventListener('click', e=>{
    newTitulo = document.getElementsByName('newTitle')[0].value;
    db.collection('tasks').doc(updateId).update({
        title: newTitulo
    });
    document.getElementsByName('newTitle')[0].value='';
})

form.addEventListener('submit', e =>{
    e.preventDefault();
    db.collection('tasks').add({
        title: form.titulo.value
    });
    form.titulo.value='';

})

db.collection('tasks').orderBy('title').onSnapshot(snapshot=>{
    let cambios = snapshot.docChanges();
    cambios.forEach(cambio =>{
        if(cambio.type == 'added'){
            renderList(cambio.doc);
        }else if(cambio.type == 'removed'){
            let li = lista.querySelector(`[data-id=${cambio.doc.id}]`);
            lista.removeChild(li);
        }else if(cambio.type == 'modified'){
            let li = lista.querySelector(`[data-id=${cambio.doc.id}]`);
            li.getElementsByTagName('span')[0].textContent = newTitulo;
            newTitulo = '';
        }
    })
})

