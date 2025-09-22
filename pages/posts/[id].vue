
<template>
  <div>
    <h1>Perfil de usuario</h1>
    <p>ID de usuario: {{ $route.params.id }}</p>
  </div>
</template>

<script setup>
const ruta = useRoute(); 
console.log(ruta.params.id); // Ahora usa la variable correcta
</script>