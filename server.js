const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,  
    GraphQLInputObjectType
} = require('graphql')
const app = express()

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. Rowling David' },
    { id: 3, name: 'J. K. Brent Weeks' }

]

const books = [
    { id: 1, name: 'Harry Potter and The Chamber Of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Ran From Prison', authorId: 1 },
    { id: 3, name: 'The Fellowship Of The RIng', authorId: 1 },
    { id: 4, name: 'Harry And The Scorpion', authorId: 2 },
    { id: 5, name: 'Harry Returns', authorId: 2 },
    { id: 6, name: 'Harry Potter And The Seven Dwarfs', authorId: 3 },
    { id: 7, name: 'The way Of the Shadows', authorId: 3 },
    { id: 8, name: 'Beyond The Shadows', authorId: 2 }

]

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: { 
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
            
//             }
//         })
//     })
// })

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This Reps. A Book written by an Author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            } 
        
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This Reps. an Author of a Book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        books: { 
            type: new GraphQLList(BookType),
            resolve: (author) => {
               return books.filter(book => book.authorId === author.Id)
            }
        
        }
        
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType, 
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType), 
            description: 'List Of All Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType), 
            description: 'List Of All Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType, 
            description: 'A single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args)  => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book)
                return book
            }
        

        },

        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
        
            },
            resolve: (parent, args) => {
                const author = { id: authors.length + 1, name: args.name, authorId: args.authorId }
                authors.push(author)
                return author
            }
        

        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
   schema: schema, 
   graphiql: true
}))
app.listen(5000., () => console.log('Server Running'))