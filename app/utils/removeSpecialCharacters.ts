export default function removeSpecialCharacters(input: string) {
  return input
    .normalize("NFD") // Normaliser les caractères diacritiques en caractères de base et de diacritiques séparés
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les caractères diacritiques qui peuvent être restants
    .replace(/[^\w\s.-]/g, "") // Remplacer les caractères spéciaux autres que les lettres, chiffres, espaces, tirets et points par une chaîne vide
    .replace(/[\s_-]+/g, "-") // Remplacer les espaces et tirets multiples par un seul tiret
    .toLowerCase(); // Convertir la chaîne en minuscules
}
