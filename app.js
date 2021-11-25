const express = require('express')
const app = express()

const Subscription = require('./models/subscriptionModel')
const mongoose = require('mongoose')
const DB_URL = `mongodb://dev:dev@cluster0-shard-00-00.nz5xy.mongodb.net:27017,cluster0-shard-00-01.nz5xy.mongodb.net:27017,cluster0-shard-00-02.nz5xy.mongodb.net:27017/fiddle_db?authSource=admin&replicaSet=atlas-22r9rt-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`
mongoose.connect(DB_URL, {})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Mongoose connecté'))


const dev = true

app.get('/',(req, res) => {
	res.send('hello there')
})


app.get('/contractReferences', subscriptionContractList, (req, res) => {
	const contract_refs = req.subscriptions

	contract_refs.success 
		? res.send(contract_refs.references)
		: res.json(contract_refs.errors) 
})

let options = {
	select: 'Company current_status started_on contract_reference',
	limit: 0,
	skip: 0,
	where: [{
		'current_status': 'processing',
		'started_on': { $gt : new Date('2018 12 30') }
	}]
}

function subscriptionContractList(req, res, next) {
	console.log('getting datas')

	const args = options.where[0]

	try {
		var datas = {
			success: false,
			references: [],
		}

		Subscription.find(args, (err, data) => {
			if (err) { datas['dev_errors'] = { status: 418, error: 'I\'m a teapot', }; datas['errors'] = err } 
			else { 
				/* Pour la boucle ->
				const contract_references = []
				data.map(sub => {
					contract_references.push(sub.contract_reference)
				})
				*/
	
				const contract_references_list = data
					.map(sub => 	{ return sub.contract_reference })
					.sort((a, b) => { return a - b })	
					// Sort + skip + limit sur la query
	
				if (dev) datas['count'] = contract_references_list.length
	
				datas['references'] = contract_references_list
				datas['success'] = true
			}
	
			req.subscriptions = datas
			next()
		})
		.skip(options.skip)
		.limit(options.limit)
		.sort({ contract_reference: 1 })
	} catch(err) { req.subscriptions = { success: false, errors: err }; next() }
}

/*
L'objectif de cet exercice :
1 - OK - Créer une route express de type get avec l'url de votre choix
1 - OK - Dans cette route, obtenir un tableau contenant tous les subscriptions dont le "current_status" est en "processing" et dont la date started_on est APRES le 30/12/2018 a l'aide de la fonction subscriptionContractList
2 - OK - Réaliser une boucle sur le tableau obtenu afin de récupérer le "contract_reference" et ajouter ce dernier a un tableau de contract_references et trier le tableau par ordre de reference descendant (utiliser les fonctions vanilla de js/es6 - pas de librairie type lodash)
4 - OK - Retourner le tableau a l'aide d'un res.json() dans un objet javascript avec deux set de clés / valeurs : "success: true" et "references: votretableau"
5 - OK - Afficher le tableau dans une liste html via res.render
5 - OK - Les erreurs qui peuvent etre retournées par la fonction subscriptionContractList doivent dans l'idéal aussi etre gérées (via un res.json avec success false et retournant l'erreur)
3 - OK - Rendre (res.render) le tableau dans une liste vers une page HMTL

Pour ce test, n'hésitez pas a vous aider des differentes documentations existantes. mongoose, express, etc..
Il n'est pas necessaire de faire une application fonctionnelle, la route et le HTML suffisent, meme si on ne peux pas les éxecuter.
*/

const port = 3001
app.listen(port)
