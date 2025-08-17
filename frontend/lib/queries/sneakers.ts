// export const GET_ALL_SNEAKERS = `
//   query {
//     sneakers {
//       documentId
//       name
//       price
//       image {
//         url
//       }
//     }
//   }
// `;



// В тому  що вище додати t itle і slug. Бо зараз їх нема в файлах, і тоді можна використати запрос по слаг знизу

// export const GET_SNEAKER_BY_SLUG = `
//   query ($slug: String!) {
//     sneakers(filters: { slug: { eq: $slug } }) {
//       documentId
//       title
//       description
//       price
//       image {
//         url
//       }
//     }
//   }
// `;