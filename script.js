const express = require('express');
const Sequelize = require('sequelize')


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'pandas.db'
})

const Pandas = sequelize.define('Pandas', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Type: Sequelize.STRING,
    Name: Sequelize.NUMBER,
    Weight: Sequelize.INTEGER,
    Months: Sequelize.INTEGER
}, { timestamps: false })


sequelize.sync({ alter: true })
    .then(() => {
        console.log('tables created')
    })

const app = express()
const port = 3000

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url)
    next()
})


app.use(express.static('public'))
app.use(express.json())


app.get('/pandas', async (req, res, next) => {
    try {
        const pandas = await Pandas.findAll()
        res.status(200).json(pandas)
    } catch (error) {
        next(error)
    }
})


app.get('/panda/:id', async (req, res, next) => {
    try {
        const panda = await Pandas.findByPk(req.params.id)
        res.status(200).json(panda)
    } catch (error) {
        next(error)
    }
})


app.delete('/panda/:id', async (req, res, next) => {
    try {
        const panda = await Pandas.findByPk(req.params.id)
        if (panda) {
            await panda.destroy()
            res.status(202).send({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.post('/pandas', async (req, res, next) => {
    try {
        const panda = await Pandas.create(req.body)
        res.status(201).json(panda)
    } catch (error) {
        next(error)
    }
})


app.put('/pandas/:id', async (req, res, next) => {
    try {
        const panda = await Pandas.findByPk(req.params.id)
        if (panda) {
           
            panda.Type = req.body.Type
            panda.Name = req.body.Name
            panda.Weight = req.body.Weight
            panda.Months = req.body.Months
            await panda.save()
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})


app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})


app.listen(port)