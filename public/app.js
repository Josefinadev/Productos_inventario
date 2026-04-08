const form = document.getElementById("product-form");
const productIdInput = document.getElementById("product-id");
const nombreInput = document.getElementById("nombre");
const descripcionInput = document.getElementById("descripcion");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const categoriaInput = document.getElementById("categoria");
const tableBody = document.getElementById("products-table-body");
const feedback = document.getElementById("feedback");
const formTitle = document.getElementById("form-title");
const cancelEditButton = document.getElementById("cancel-edit");
const refreshButton = document.getElementById("refresh-products");
const focusTableButton = document.getElementById("focus-table");
const inventoryStatus = document.getElementById("inventory-status");
const productCount = document.getElementById("product-count");

function showFeedback(message, type = "success") {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.className = "feedback";
}

function resetForm() {
  form.reset();
  productIdInput.value = "";
  formTitle.textContent = "Registrar producto";
  cancelEditButton.classList.add("hidden");
}

function getFormData() {
  return {
    nombre: nombreInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    precio: precioInput.value,
    stock: stockInput.value,
    categoria: categoriaInput.value
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.errors ? data.errors.join(" ") : data.message;
    throw new Error(detail || "Ocurrio un error al procesar la solicitud");
  }

  return data;
}

function renderProducts(products) {
  productCount.textContent = `${products.length}`;
  inventoryStatus.textContent = products.length ? "Actualizado" : "Vacio";

  if (!products.length) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No hay productos registrados.</td></tr>';
    return;
  }

  tableBody.innerHTML = products.map((product) => `
    <tr>
      <td>${product.nombre}</td>
      <td>${product.descripcion}</td>
      <td>S/ ${Number(product.precio).toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>${product.categoria}</td>
      <td class="actions">
        <button class="table-button edit" data-id="${product._id}">Editar</button>
        <button class="table-button delete" data-id="${product._id}">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

async function loadProducts() {
  try {
    inventoryStatus.textContent = "Sincronizando";
    const products = await request("/productos");
    renderProducts(products);
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="6" class="empty-state">${error.message}</td></tr>`;
    inventoryStatus.textContent = "Error";
    showFeedback(error.message, "error");
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  clearFeedback();

  const id = productIdInput.value;
  const method = id ? "PUT" : "POST";
  const url = id ? `/productos/${id}` : "/productos";

  try {
    const data = await request(url, {
      method,
      body: JSON.stringify(getFormData())
    });

    showFeedback(data.message || "Operacion completada correctamente");
    resetForm();
    await loadProducts();
  } catch (error) {
    showFeedback(error.message, "error");
  }
}

async function handleTableClick(event) {
  const button = event.target.closest("button[data-id]");

  if (!button) {
    return;
  }

  const { id } = button.dataset;

  if (button.classList.contains("edit")) {
    try {
      const product = await request(`/productos/${id}`);
      productIdInput.value = product._id;
      nombreInput.value = product.nombre;
      descripcionInput.value = product.descripcion;
      precioInput.value = product.precio;
      stockInput.value = product.stock;
      categoriaInput.value = product.categoria;
      formTitle.textContent = "Editar producto";
      cancelEditButton.classList.remove("hidden");
      showFeedback("Producto cargado para edicion");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showFeedback(error.message, "error");
    }
  }

  if (button.classList.contains("delete")) {
    const confirmed = window.confirm("Seguro que deseas eliminar este producto?");

    if (!confirmed) {
      return;
    }

    try {
      const data = await request(`/productos/${id}`, {
        method: "DELETE"
      });
      showFeedback(data.message);
      if (productIdInput.value === id) {
        resetForm();
      }
      await loadProducts();
    } catch (error) {
      showFeedback(error.message, "error");
    }
  }
}

form.addEventListener("submit", handleSubmit);
tableBody.addEventListener("click", handleTableClick);
cancelEditButton.addEventListener("click", () => {
  resetForm();
  clearFeedback();
});
refreshButton.addEventListener("click", loadProducts);
focusTableButton.addEventListener("click", () => {
  document.getElementById("inventory-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

loadProducts();
