const express = require('express');
const Category = require('../models/Category')
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
   try {
    const categories = await Category.find();
    res.json({
        message: "You are viewing all categories",
        numberOfCategories: categories.length,
        categories: categories.map(category => {
            return {
                sumOfSales: category.price * category.numberOfItemsSold,
                id: category._id, 
                title: category.title,
                price: category.price,
                numberOfItemsSold: category.numberOfItemsSold,
                parent: category.parent,
                ancestors: category.ancestors
            }
        })
    });
   } catch (err) {
       res.json({ message: err.message })
   }
});

router.get('/:categoryId', async (req, res) => {
    try {
      const category = await Category.findById(req.params.categoryId);
      res.status(200).json(category);
    } catch (err) {
        res.status(404).json({ message: "The category with the provided ID does not exist" });
    }
})

router.post('/', async (req, res) => {
    const parent = req.body.parent ? req.body.parent : null;
    if (parent != null) {
        const checkIfParentHasPrice = (await Category.findById(req.body.parent)).toJSON()
        if (checkIfParentHasPrice.price != null) {
            return res.status(500).json({
                message: 'Category cannot have a sub category if the price was set'
            })
        }
    }
    const category = new Category({
        title: req.body.title,
        price: req.body.price,
    });
    try { 
        buildAncestors(category._id, parent)
        buildParent(category._id, parent)
        const savedCategory = await category.save();
        res.status(201).send({ 
            message: "You have successfully created a category!",
            sumOfSales: savedCategory.price * savedCategory.numberOfItemsSold,
            id: savedCategory._id, 
            title: savedCategory.title,
            price: savedCategory.price,
            numberOfItemsSold: savedCategory.numberOfItemsSold,
            });
    } catch (err) {
        res.status(500).send(err.message)
    }
});


const buildAncestors = async (id, parent_id) => {
  const categoryAncestors = [];
  try {
      const parent_category = await Category.findOne({ "_id": parent_id }, { "title": 1, "price": 1, "ancestors": 1 }).exec();
        
    if( parent_category ) {
         const { _id, title, price } = parent_category;
         const categoryAncestors = [...parent_category.ancestors];
         categoryAncestors.unshift({ _id, title, price })
         const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": categoryAncestors } });
    }
    } catch (err) {
        console.log(err.message)
     }
}

const buildParent = async (id, parent_id) => {
    const par = [];
    try {
        const parent_category = await Category.findOne({ "_id": parent_id }, { "title": 1, "price": 1, "parent": 1 }).exec();
          
      if( parent_category ) {
           const { _id, title, price } = parent_category;
           par.unshift({ _id, title, price })
           console.log(par[0].price)
           const category = await Category.findByIdAndUpdate(id, { $set: { "parent": par } });
      }
      } catch (err) {
          console.log(err.message)
       }
  }
  

router.delete('/:categoryId', async (req, res) => {
    try {
        const removedCategory = await Category.remove({ _id: req.params.categoryId })
        res.status(200).send({  message: "Your Category was successfully deleted!" });
    } catch (err) {
        res.json({ message: err.message })
    }
})

router.patch('/:categoryId', async (req, res) => {
    try {
        const updatedCategory = await Category.updateOne(
            { _id: req.params.categoryId},
            { $set: { 
                title: req.body.title,
                price: req.body.price,
                numberOfItemsSold: req.body.numberOfItemsSold,
             }}
            );
        res.status(200).json({
            message: 'Category updated!',
            title: req.body.title,
            price: req.body.price,
            numbersOfItemsSold: req.body.numberOfItemsSold,
            sumOfSales: req.body.price * req.body.numberOfItemsSold
        });
        console.log(result)

    } catch (err) {
        res.json({ message: err.message })
    }
});


module.exports = router;
