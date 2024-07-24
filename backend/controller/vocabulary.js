const index = require('../errors/index');
const Vocabulary = require('../model/vocabulary');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllVocabs = async (req, res) => {
    try {
        const vocabs = await Vocabulary.find({})

        res.status(200).json(vocabs)
    } catch (error) {
        res.status(500).json({msg: error})
    }
    
}

const addVocab = async (req, res) => {
    try {
        const { tokyoJapanese, miyazakiJapanese } = req.body;
        const vocabs = await Vocabulary.findOne({tokyoJapanese: tokyoJapanese, miyazakiJapanese: miyazakiJapanese});
        if (!tokyoJapanese) {
            return res.status(400).json({msg: 'Please enter the Tokyo Japanese version'});
        }
        if (!miyazakiJapanese) {
            return res.status(400).json({msg: 'Please enter the Miyazaki Japanese version'});
        }
        if (vocabs) {
            return res.status(400).json({msg: 'We already have this conversion!'});
        }
        const vocab = await Vocabulary.create({...req.body});
        res.status(201).json({msg:`${vocab.tokyoJapanese} <---> ${vocab.miyazakiJapanese} has been added!`})
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

const getTokyoVocab = async (req, res) => {
        const { vocabulary:miyazakiVocab } = req.params;
        const vocab = await Vocabulary.find({miyazakiJapanese:miyazakiVocab})
        if (vocab.length == 0) {
            //throw new NotFoundError(`No translation for ${miyazakiVocab} is found`)
            return res.status(404).json();
        }
        res.status(200).json({ vocab })
    } 


const getMiyazakiVocab = async (req, res) => {

        const { vocabulary:tokyoVocab } = req.params;
        const vocab = await Vocabulary.find({tokyoJapanese: tokyoVocab})
        if (vocab.length == 0) {
            //throw new NotFoundError(`No translation for ${tokyoVocab} is found`)
            return res.status(404).json(0);
        }
        res.status(200).json({ vocab })
    
}

module.exports = {
    addVocab,
    getTokyoVocab,
    getMiyazakiVocab,
    getAllVocabs,
}