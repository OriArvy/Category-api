# Category-api

This is an API to create categories.
 
This project was created using NodeJs, Express and Mongoose using Tree structured database model.

The tree structured database works like the usual tree. In the database you can see ancestors and parents
however if your last child has set a "price" parameter, this API will throw an error, as the last child becomes an item itself and cannot have anymore child categories.


In order to get this app running on your machine, you will need two things. First you will need to install NodeJs which you can get here: https://nodejs.org/en/
Secondly, you will need a tool to view your API calls, I personally used Postman, you can find more about it here: https://www.postman.com/

Next, you will need to clone this git repository which you can read more about here: https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository

After you have successfully cloned the application, you can now open the code editor and run npm install, to install all the required packages and you should be good to go!

In order to run the server use command: npm run start

In order to run the tests use command: npm run test

IMPORTANT: Some tests contain hardcoded information such as parentId, therefore if you do not use the same database those tests may fail please adjust accordingly.

# Functionality and how to use:

Next up lets see the functionality and usage of this app. I will try to provide an example of every key feature.

In this example I will be creating a tree structured example of self-checkout item search at a grocery store which should go as following:

(parent)=>(sub-category)=>(sub-category)=>(item)

Groceries => Fruits&Vegetables => Citrus Fruits => Orange. 

# Creating a category:
Lets boot up our postman, and go to https://localhost:3000/categories and select POST method.
For this task all we need is a title for the category, in this case it is Groceries.
[![Groceries.png](https://i.postimg.cc/T2DWWZ7k/Groceries.png)](https://postimg.cc/Z0JqGDh3)

We can see that our category has been successfully created, judging from the message we got so we can move on!
I would still recommended to double check by selecting a get request and pasting the ID into our postmans path.

# Creating a sub-category:
To create a sub category we will need 2 things:
1. We still need a title to give to our category.
2. And now we need to provide the ID of our parent category which this sub-category should belong to, in this case it is our previously created groceries ID.
[![Fruits-And-Vegetables.png](https://i.postimg.cc/V6Mk3x5G/Fruits-And-Vegetables.png)](https://postimg.cc/1nmSFYGw)

Once again, we should have seen the success message, and now we have our sub-category!

# Creating a category with price:
To create our category with price we will need 3 things:
1. Title.
2. An ID of our Parent category.
3. Price of our item.
[![Orange.png](https://i.postimg.cc/ZKvVXjL9/Orange.png)](https://postimg.cc/1fPGqG2P)
If we provided everything correctly we should be once again greeted with a success message.

# Seeing our results:

In order to see our result, we first should change our request from POST to GET
And now we have 2 options, we can look for a specific Category, or we can look for all the Categories at once.
This time it makes sense to see only our desired category therefore thats what I will look for.

In our Postmans box down below, we can see that we got an ID for our item, so lets copy it and paste it into our Postmans path and hopefully we should get everything.
[![Final.png](https://i.postimg.cc/ncd9YtmB/Final.png)](https://postimg.cc/VdCNmpDk)

As we can see we get, all the ancestors (Groceries, Fruits&Vegetables, Citrus Fruits), we get our parent category(Citrus Fruits), and now we have an item(Orange)
If we try to create another sub-category where we provide ID of our Orange category, we will be getting the following error:
[![error.png](https://i.postimg.cc/PxZFY4Fv/error.png)](https://postimg.cc/PpX4kmHd)

# Poor Mans Orders:

In this project, since we are working with categories and items it made sense to have an order function.

However I did not implement, a fully functioning Order system, instead I have implemented a very small and not very effective ordering system hence the name Poor Mans Oders.

You can add an order to an existing item, by finding the ID of that said item, and changing numberOfItemsSold field property with Patch method.
Lets demonstrate it on our Orange example.
Once we have the ID of Orange, we should once again change the Postmans Path with according ID, select PATCH Method. We should still keep the Title and Price fields
and we should also add a numberOfItemsSold like so:
[![Patch.png](https://i.postimg.cc/NfTJnpgN/Patch.png)](https://postimg.cc/YhrzGNLg)
And if we succeed, we should now see the changed information, and we can also see the sumOfSales field which automatically updates depending on price and numberOfItemsSold.

# Delete function:
Deleting an item or category is quite simple, we just simply pass the ID of the category we would like to delete to our Postmans Path and send the request, and thats it!
