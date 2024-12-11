const baseUrl = "http://localhost:3000";
const userList = document.getElementById("userList");
const addUserBtn = document.getElementById("addUserBtn");
const newUserName = document.getElementById("newUserName");
let users = [];

const loadUsers = () => {
  fetch(`${baseUrl}/users`)
    .then((response) => response.json())
    .then((data) => {
      users = data;
      userList.innerHTML = "";
      users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.className =
          "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
          ${user.id} - ${user.name}
          <div>
            <button class="btn btn-warning btn-sm edit-user" data-id="${user.id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Eliminar</button>
          </div>
        `;
        userList.appendChild(listItem);
      });

      document.querySelectorAll(".edit-user").forEach((button) => {
        button.addEventListener("click", () =>
          handleEditUser(button.getAttribute("data-id"))
        );
      });
      document.querySelectorAll(".delete-user").forEach((button) => {
        button.addEventListener("click", () =>
          handleDeleteUser(button.getAttribute("data-id"))
        );
      });
    })
    .catch((error) => {
      console.error(error);
      alert("Hubo un problema cargando los usuarios.");
    });
};

addUserBtn.addEventListener("click", () => {
  const name = newUserName.value.trim();
  if (name) {
    fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Usuario agregado: ${data.name}`);
        newUserName.value = "";
        loadUsers();
      })
      .catch((error) => {
        console.error(error);
        alert("Hubo un problema al agregar el usuario.");
      });
  } else {
    alert("Por favor, ingresa un nombre válido.");
  }
});

const handleEditUser = (id) => {
  const newName = prompt("Ingresa el nuevo nombre del usuario:");
  if (newName) {
    fetch(`${baseUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Usuario actualizado: ${data.name}`);
        loadUsers();
      })
      .catch((error) => {
        console.error(error);
        alert("Hubo un problema al actualizar el usuario.");
      });
  }
};

const handleDeleteUser = (id) => {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    fetch(`${baseUrl}/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Usuario eliminado: ${data.name}`);
        loadUsers();
      })
      .catch((error) => {
        console.error(error);
        alert("Hubo un problema al eliminar el usuario.");
      });
  }
};

const searchUsers = () => {
  const searchInput = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchInput)
  );

  userList.innerHTML = "";
  filteredUsers.forEach((user) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `
      ${user.id} - ${user.name}
      <div>
        <button class="btn btn-warning btn-sm edit-user" data-id="${user.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-user" data-id="${user.id}">Eliminar</button>
      </div>
    `;
    userList.appendChild(listItem);
  });
};

document.getElementById("searchInput").addEventListener("input", searchUsers);

loadUsers();
