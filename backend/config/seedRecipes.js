const Recipe = require('../models/Recipe');
const User = require('../models/User');

const seedRecipesData = [
  {
    title: 'Creamy Tuscan Garlic Chicken',
    description: 'Tender pan-seared chicken breasts smothered in a rich garlic, sun-dried tomato, and spinach parmesan cream sauce.',
    ingredients: [
      '2 large chicken breasts, halved horizontally',
      '2 tbsp olive oil',
      '1 cup heavy cream',
      '1/2 cup chicken broth',
      '1 tsp garlic powder',
      '1 cup fresh baby spinach',
      '1/2 cup sun-dried tomatoes, drained',
      '1/2 cup freshly grated parmesan cheese',
      'Salt and freshly ground black pepper'
    ],
    instructions: `1. Season chicken breasts on both sides with salt, pepper, and garlic powder.\n2. Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5-6 minutes per side until golden brown and cooked through (165°F internal). Transfer chicken to a plate.\n3. In the same skillet, reduce heat to medium. Add chicken broth, heavy cream, and parmesan cheese. Whisk until smooth and bubbling.\n4. Stir in baby spinach and sun-dried tomatoes. Simmer for 2-3 minutes until spinach is wilted.\n5. Return chicken to the skillet, spoon sauce over the top, and serve warm with pasta or crusty bread.`,
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Isabella Rossi'
  },
  {
    title: 'Authentic Italian Margherita Pizza',
    description: 'Crispy wood-fired style homemade crust topped with San Marzano tomato sauce, fresh mozzarella, and fragrant basil leaves.',
    ingredients: [
      '300g pizza dough (flour, yeast, warm water, olive oil)',
      '1/2 cup crushed San Marzano canned tomatoes',
      '200g fresh buffalo mozzarella, sliced',
      '10 fresh basil leaves',
      '2 tbsp extra virgin olive oil',
      'Pinch of sea salt'
    ],
    instructions: `1. Preheat oven to the highest temperature (500°F/260°C) with a pizza stone or baking tray inside.\n2. Stretch pizza dough on a floured surface into a 12-inch circle with slightly raised crust edges.\n3. Spread tomato sauce evenly over the dough, leaving a 1-inch border.\n4. Arrange fresh mozzarella slices across the sauce and season with a pinch of sea salt.\n5. Bake for 9-12 minutes until crust is crispy and golden brown with bubbling cheese.\n6. Garnish with fresh basil leaves and a drizzle of extra virgin olive oil before slicing.`,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Marco Bellini'
  },
  {
    title: 'Classic Butter Chicken (Murgh Makhani)',
    description: 'Tender marinated chicken pieces simmered in an aromatic, velvety spiced tomato, butter, and cream curry.',
    ingredients: [
      '500g boneless chicken thighs, cut into cubes',
      '1 cup Greek yogurt',
      '2 tbsp ginger-garlic paste',
      '2 tbsp butter',
      '1 cup tomato puree',
      '1/2 cup heavy cream',
      '1 tbsp garam masala',
      '1 tsp Kashmiri red chili powder',
      '1 tsp dried fenugreek leaves (kasuri methi)',
      'Fresh cilantro for garnish'
    ],
    instructions: `1. Marinate chicken with yogurt, half of ginger-garlic paste, chili powder, and salt for at least 30 minutes.\n2. Sear the chicken in a hot pan or grill until lightly charred and 80% cooked. Set aside.\n3. In a heavy pan, melt butter over medium heat. Sauté remaining ginger-garlic paste for 1 minute.\n4. Add tomato puree, garam masala, and chili powder. Cook for 8-10 minutes until oil separates from the gravy.\n5. Stir in heavy cream and crushed kasuri methi until silky smooth.\n6. Add cooked chicken and simmer on low heat for 6-8 minutes. Garnish with fresh cilantro and serve with butter naan or basmati rice.`,
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Rajesh Sharma'
  },
  {
    title: 'Juicy Gourmet Smash Burger',
    description: 'Double beef patties smashed extra thin with caramelized crispy edges, melted cheddar, pickles, and secret homemade burger sauce.',
    ingredients: [
      '300g ground beef chuck (80/20 lean to fat ratio)',
      '2 brioche burger buns, toasted',
      '2 slices sharp cheddar cheese',
      '4 slices dill pickles',
      '1/2 small white onion, thinly sliced',
      '2 tbsp mayonnaise',
      '1 tbsp ketchup',
      '1 tsp Dijon mustard',
      'Salt and coarse black pepper'
    ],
    instructions: `1. Mix mayo, ketchup, and mustard in a small bowl to make the special burger sauce.\n2. Divide ground beef into two loose 75g balls. Do not overwork the meat.\n3. Heat a cast-iron skillet on high until smoking hot.\n4. Place meat balls on the skillet and smash firmly using a flat spatula and parchment paper until paper thin.\n5. Season generously with salt and pepper. Cook for 2 minutes until edges are deeply browned and crispy.\n6. Flip, top immediately with cheddar cheese, and cook for 1 more minute until cheese melts.\n7. Spread burger sauce on toasted brioche buns, stack double patties with onions and pickles, and serve immediately.`,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Jack Thompson'
  },
  {
    title: 'Authentic Japanese Tonkotsu Ramen',
    description: 'Steaming bowl of rich pork-style broth served with springy ramen noodles, soft-boiled marinated egg, and green onions.',
    ingredients: [
      '2 packs fresh ramen noodles',
      '4 cups rich bone broth or dashi broth',
      '2 tbsp white miso paste',
      '1 tbsp soy sauce',
      '1 tbsp sesame oil',
      '2 soft-boiled ramen eggs (ajitsuke tamago), halved',
      '1 cup sliced shiitake mushrooms',
      '2 stalks green onions, finely chopped',
      'Nori seaweed sheets'
    ],
    instructions: `1. In a medium soup pot, heat sesame oil and sauté mushrooms for 3 minutes.\n2. Pour in the broth and bring to a gentle simmer. Whisk in miso paste and soy sauce until completely dissolved.\n3. In a separate pot of boiling water, cook ramen noodles for 2-3 minutes according to package instructions. Drain well.\n4. Divide hot noodles into deep serving bowls.\n5. Ladle piping hot aromatic broth and mushrooms over noodles.\n6. Top each bowl with half a soft-boiled egg, nori sheets, and a generous sprinkle of chopped green onions.`,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Kenji Sato'
  },
  {
    title: 'Crispy Homemade Belgian Waffles',
    description: 'Golden, crispy on the outside and fluffy on the inside Belgian waffles served with fresh berries, maple syrup, and whipped cream.',
    ingredients: [
      '2 cups all-purpose flour',
      '2 tbsp granulated sugar',
      '1 tbsp baking powder',
      '1/2 tsp salt',
      '2 large eggs, separated',
      '1 3/4 cups warm milk',
      '1/2 cup unsalted butter, melted',
      '1 tsp pure vanilla extract',
      'Fresh strawberries and blueberries for topping',
      'Pure maple syrup'
    ],
    instructions: `1. Preheat your waffle iron according to manufacturer instructions.\n2. In a large bowl, whisk flour, sugar, baking powder, and salt.\n3. In a separate bowl, whisk egg yolks, milk, melted butter, and vanilla extract.\n4. In a clean third bowl, beat egg whites with a hand mixer until stiff peaks form.\n5. Pour wet ingredients into dry ingredients and stir until just combined.\n6. Gently fold whipped egg whites into the batter with a spatula for maximum fluffiness.\n7. Pour batter onto hot waffle iron and cook until golden brown and steam stops releasing (about 4-5 minutes).\n8. Serve hot topped with fresh berries, powdered sugar, and maple syrup.`,
    imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Sophie Laurent'
  },
  {
    title: 'Fresh Mediterranean Greek Salad',
    description: 'Crisp English cucumbers, ripe tomatoes, Kalamata olives, thinly sliced red onion, and creamy block feta dressed in herb vinaigrette.',
    ingredients: [
      '3 ripe vine tomatoes, cut into wedges',
      '1 English cucumber, diced into chunks',
      '1/2 red onion, thinly sliced',
      '1/2 cup pitted Kalamata olives',
      '150g authentic Greek feta cheese block',
      '1/4 cup extra virgin olive oil',
      '1 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Pinch of sea salt and cracked pepper'
    ],
    instructions: `1. In a large salad bowl, combine tomatoes, cucumber chunks, red onion slices, and Kalamata olives.\n2. In a small jar or bowl, whisk extra virgin olive oil, red wine vinegar, dried oregano, salt, and black pepper.\n3. Pour the dressing over the vegetables and toss gently to coat evenly.\n4. Place a slab of feta cheese on top of the salad.\n5. Sprinkle with additional oregano and a final drizzle of olive oil before serving chilled.`,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Elena Papadopoulos'
  },
  {
    title: 'Creamy Avocado Toast with Poached Egg',
    description: 'Toasted artisanal sourdough bread topped with mashed zesty avocado, perfectly runny poached egg, chili flakes, and microgreens.',
    ingredients: [
      '2 thick slices sourdough bread',
      '1 ripe Hass avocado',
      '2 fresh eggs',
      '1 tbsp fresh lime juice',
      '1 tbsp white vinegar (for poaching)',
      '1/4 tsp red pepper chili flakes',
      '1 tbsp everything bagel seasoning',
      'Microgreens or fresh cilantro for garnish',
      'Extra virgin olive oil'
    ],
    instructions: `1. Cut avocado in half, scoop flesh into a bowl, add lime juice, salt, and mash with a fork until chunky-smooth.\n2. Bring a small pot of water to a gentle simmer. Add white vinegar and create a gentle vortex with a spoon.\n3. Crack egg into a small ramekin and gently slide into the center of the vortex. Poach for 3 minutes until white is set and yolk is runny. Remove with slotted spoon.\n4. Toast sourdough slices until golden and crunchy.\n5. Spread mashed avocado generously over toasted sourdough.\n6. Top each toast with a poached egg, sprinkle with red pepper flakes and everything bagel seasoning, and finish with microgreens.`,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Chloe Miller'
  },
  {
    title: 'Authentic Street-Style Mexican Tacos',
    description: 'Warm double corn tortillas loaded with seasoned carne asada beef, diced white onions, fresh cilantro, and tangy salsa verde.',
    ingredients: [
      '500g flank steak or skirt steak',
      '8 small corn tortillas',
      '2 limes, juiced',
      '3 cloves garlic, minced',
      '1 tsp ground cumin',
      '1/2 cup finely diced white onion',
      '1/2 cup fresh cilantro, chopped',
      '1/2 cup salsa verde or guacamole salsa',
      '2 tbsp cooking oil'
    ],
    instructions: `1. Marinate steak with lime juice, minced garlic, cumin, salt, and pepper for 20 minutes.\n2. Heat a heavy cast iron skillet or grill pan over high heat with oil.\n3. Sear steak for 3-4 minutes per side for medium-rare. Let rest on cutting board for 5 minutes, then chop into bite-sized cubes.\n4. Warm corn tortillas on a dry skillet for 30 seconds per side until pliable.\n5. Layer two tortillas together for each taco. Fill with chopped seasoned steak.\n6. Garnish with chopped white onion, fresh cilantro, a spoonful of salsa verde, and fresh lime wedges.`,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Carlos Mendez'
  },
  {
    title: 'Decadent Molten Chocolate Lava Cake',
    description: 'Individual warm chocolate cakes with a luscious flowing molten chocolate center, dusted with cocoa and served with vanilla gelato.',
    ingredients: [
      '100g premium dark chocolate (70% cocoa), chopped',
      '1/2 cup unsalted butter',
      '2 large eggs + 2 egg yolks',
      '1/3 cup granulated sugar',
      '2 tbsp all-purpose flour',
      '1 tsp pure vanilla extract',
      'Cocoa powder for dusting ramekins',
      'Vanilla bean ice cream for serving'
    ],
    instructions: `1. Preheat oven to 425°F (220°C). Butter two 6-ounce ramekins and dust inside thoroughly with cocoa powder.\n2. Melt dark chocolate and butter together in a heatproof bowl set over simmering water (or microwave in 20s intervals). Stir until silky smooth.\n3. In a separate bowl, whisk eggs, egg yolks, sugar, and vanilla until pale and slightly frothy.\n4. Fold melted chocolate mixture into the eggs, then gently fold in the flour until just combined.\n5. Divide batter evenly between the prepared ramekins.\n6. Bake for 12-14 minutes until edges are firm but center is soft and jiggles slightly.\n7. Let cool for 1 minute, then carefully invert onto dessert plates. Dust with powdered sugar and serve immediately with vanilla gelato.`,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Pierre Dubois'
  },
  {
    title: 'Creamy Garlic Butter Shrimp Pasta',
    description: 'Succulent jumbo shrimp tossed with al dente fettuccine in a velvety garlic butter white wine parmesan emulsion.',
    ingredients: [
      '400g jumbo shrimp, peeled and deveined',
      '250g fettuccine pasta',
      '4 tbsp unsalted butter',
      '4 cloves garlic, finely minced',
      '1/3 cup dry white wine or chicken broth',
      '1/2 cup grated parmesan cheese',
      '1/4 cup fresh parsley, chopped',
      'Juice of 1/2 lemon',
      'Salt and red pepper flakes'
    ],
    instructions: `1. Cook fettuccine in salted boiling water until al dente. Reserve 1/2 cup of starchy pasta water before draining.\n2. Melt 2 tbsp butter in a large skillet over medium-high heat. Add shrimp, season with salt and pepper, and cook for 1.5 minutes per side until pink. Remove shrimp.\n3. In the same skillet, add remaining butter and minced garlic. Sauté for 1 minute until fragrant.\n4. Pour in white wine and lemon juice, scraping up brown bits. Simmer for 2 minutes.\n5. Add drained fettuccine, cooked shrimp, and grated parmesan. Toss vigorously, adding splashes of pasta water to create a glossy sauce.\n6. Garnish with chopped fresh parsley and red pepper flakes before serving hot.`,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Antonio Conti'
  },
  {
    title: 'Crispy Asian Chicken Dumplings (Gyoza)',
    description: 'Pan-fried potstickers with crispy golden bottoms filled with savory minced chicken, ginger, cabbage, and scallions.',
    ingredients: [
      '1 pack round gyoza dumpling wrappers',
      '300g ground chicken',
      '1 cup napa cabbage, finely shredded',
      '2 green onions, minced',
      '1 tbsp fresh ginger, grated',
      '2 cloves garlic, minced',
      '1 tbsp soy sauce',
      '1 tsp toasted sesame oil',
      'Dipping sauce: 2 tbsp soy sauce + 1 tbsp rice vinegar + chili oil'
    ],
    instructions: `1. In a bowl, combine ground chicken, cabbage, green onions, ginger, garlic, soy sauce, and sesame oil. Mix thoroughly.\n2. Place a wrapper in your palm, add 1 tsp filling to center. Wet wrapper edges with water.\n3. Fold in half and create 4-5 pleats along the top edge to seal securely.\n4. Heat 1 tbsp oil in a non-stick skillet over medium-high heat. Place dumplings flat-side down and cook for 2 minutes until bottom is golden and crispy.\n5. Pour 1/4 cup water into skillet, cover immediately with lid, and steam for 4-5 minutes until wrappers are translucent.\n6. Remove lid and let remaining moisture evaporate so bottom crisps up again. Serve with dipping sauce.`,
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Mei-Ling Chen'
  },
  {
    title: 'Superfood Quinoa & Roasted Veggie Buddha Bowl',
    description: 'Nourishing warm bowl of fluffy quinoa, roasted sweet potatoes, crispy chickpeas, avocado, and creamy lemon tahini dressing.',
    ingredients: [
      '1 cup cooked tricolor quinoa',
      '1 medium sweet potato, cubed',
      '1 can (400g) chickpeas, rinsed and drained',
      '2 cups fresh kale leaves, chopped',
      '1 ripe avocado, sliced',
      '2 tbsp olive oil',
      '1 tsp smoked paprika',
      'Tahini dressing: 3 tbsp tahini + 2 tbsp warm water + 1 tbsp lemon juice + 1 tsp maple syrup'
    ],
    instructions: `1. Preheat oven to 400°F (200°C).\n2. Toss cubed sweet potato and chickpeas with olive oil, smoked paprika, salt, and pepper on a baking sheet.\n3. Roast for 25-30 minutes until sweet potatoes are tender and chickpeas are crispy.\n4. Whisk tahini, warm water, lemon juice, and maple syrup in a small bowl until smooth and pourable.\n5. Assemble bowl: place warm quinoa as the base, arrange roasted sweet potatoes, crispy chickpeas, kale, and sliced avocado.\n6. Drizzle generously with creamy lemon tahini dressing and enjoy.`,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Maya Green'
  },
  {
    title: 'Creamy Classic Mushroom Risotto',
    description: 'Slow-simmered Arborio rice with caramelized wild mushrooms, white wine, rich vegetable broth, and aged parmesan cheese.',
    ingredients: [
      '1 1/2 cups Arborio rice',
      '300g mixed mushrooms (cremini, shiitake), sliced',
      '4 cups warm vegetable or chicken broth',
      '1/2 cup dry white wine',
      '1 medium shallot, finely diced',
      '3 tbsp unsalted butter',
      '1/2 cup freshly grated parmesan cheese',
      '2 tbsp fresh thyme leaves'
    ],
    instructions: `1. In a pan, melt 1 tbsp butter and sauté sliced mushrooms with thyme for 5 minutes until browned. Set aside.\n2. In a heavy-bottomed saucepan, melt 1 tbsp butter over medium heat. Sauté shallot for 2 minutes.\n3. Add Arborio rice and toast for 1-2 minutes until translucent around the edges.\n4. Pour in white wine and stir constantly until liquid is fully absorbed.\n5. Begin adding warm broth one ladle at a time, stirring frequently and waiting until each ladle is absorbed before adding the next (about 18-20 minutes total).\n6. When rice is creamy and al dente, remove from heat. Stir in sautéed mushrooms, remaining butter, and parmesan cheese. Rest for 2 minutes and serve.`,
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Giovanni Russo'
  },
  {
    title: 'Spanish Seafood Paella Valenciana',
    description: 'Traditional saffron-infused Bomba rice loaded with jumbo shrimp, calamari, mussels, sweet bell peppers, and peas.',
    ingredients: [
      '2 cups Spanish Bomba or short-grain rice',
      '300g mixed seafood (shrimp, mussels, squid rings)',
      '4 cups warm seafood or fish broth',
      '1/2 tsp saffron threads, steeped in warm water',
      '1 red bell pepper, sliced',
      '1/2 cup sweet green peas',
      '1 medium tomato, grated',
      '3 cloves garlic, minced',
      '3 tbsp olive oil',
      'Lemon wedges for serving'
    ],
    instructions: `1. Heat olive oil in a wide, flat paella pan over medium heat. Sauté garlic, bell pepper, and grated tomato for 3-4 minutes.\n2. Add Bomba rice and stir for 2 minutes to coat every grain in the flavorful sofrito.\n3. Pour in hot broth and saffron water. Season with salt. Bring to a boil, then reduce heat to medium-low. Do NOT stir after this point to allow the crispy bottom crust (socarrat) to form.\n4. After 10 minutes, arrange shrimp, squid, mussels, and peas across the rice.\n5. Cook for another 8-10 minutes until liquid is absorbed and mussels open.\n6. Let rest covered with a towel for 5 minutes. Serve with fresh lemon wedges.`,
    imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Alejandro Morales'
  },
  {
    title: 'Traditional Thai Green Curry with Chicken',
    description: 'Fragrant and spicy coconut milk curry infused with Thai green curry paste, tender chicken breast, bamboo shoots, and Thai basil.',
    ingredients: [
      '400g chicken breast, thinly sliced',
      '1 can (400ml) full-fat coconut milk',
      '3 tbsp authentic Thai green curry paste',
      '1/2 cup bamboo shoots, sliced',
      '1 cup Thai eggplants or zucchini, diced',
      '1 tbsp fish sauce',
      '1 tbsp palm sugar or brown sugar',
      '4 kaffir lime leaves, torn',
      '1/2 cup fresh Thai sweet basil leaves'
    ],
    instructions: `1. Heat 3 tbsp of thick coconut cream from the top of the can in a wok over medium heat until oil begins to separate.\n2. Add green curry paste and fry for 2 minutes until intensely fragrant.\n3. Add sliced chicken and cook for 3-4 minutes until opaque.\n4. Pour in remaining coconut milk and bring to a gentle simmer.\n5. Add bamboo shoots, zucchini, lime leaves, fish sauce, and palm sugar. Simmer for 8-10 minutes until vegetables are tender.\n6. Turn off heat, stir in fresh Thai basil leaves, and serve hot over jasmine rice.`,
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Somchai Prasert'
  },
  {
    title: 'Fluffy Japanese Souffle Pancakes',
    description: 'Ultra-tall, airy, melt-in-your-mouth soufflé pancakes dusted with powdered sugar and drizzled with honey butter syrup.',
    ingredients: [
      '2 large eggs, separated',
      '1 1/2 tbsp whole milk',
      '1/4 tsp pure vanilla extract',
      '1/4 cup cake flour',
      '1/2 tsp baking powder',
      '2 tbsp granulated sugar',
      'Butter for cooking',
      'Maple syrup and fresh strawberries for serving'
    ],
    instructions: `1. In a bowl, whisk egg yolks, milk, and vanilla until frothy. Sift in cake flour and baking powder, whisking into a smooth batter.\n2. In a separate spotless bowl, beat egg whites with an electric mixer, gradually adding sugar until firm glossy peaks form.\n3. Gently fold 1/3 of the whipped egg whites into the yolk batter, then gently fold in the remaining whites with a spatula without deflating the air.\n4. Heat a non-stick skillet on the lowest possible heat setting and lightly grease with butter.\n5. Scoop high mounds of batter onto the pan. Add 1 tsp water to the pan and cover with lid. Cook for 4-5 minutes.\n6. Carefully flip pancakes, add 1 more tsp water, cover and cook for 4 more minutes.\n7. Serve immediately while warm and pillowy with maple syrup and berries.`,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Yuka Tanaka'
  },
  {
    title: 'Smoky BBQ Pulled Pork Sandwich',
    description: 'Slow-cooked pork shoulder shredded and tossed in sweet and tangy smoky barbecue sauce, piled high on brioche with creamy coleslaw.',
    ingredients: [
      '1kg pork shoulder (Boston butt)',
      '1 cup smoky barbecue sauce',
      '1 tbsp brown sugar',
      '1 tbsp smoked paprika',
      '1 tsp garlic powder',
      '1 tsp onion powder',
      '4 brioche buns, toasted',
      '1 cup crunchy cabbage coleslaw'
    ],
    instructions: `1. Rub pork shoulder evenly with brown sugar, smoked paprika, garlic powder, onion powder, salt, and black pepper.\n2. Place pork in slow cooker or covered Dutch oven. Cook on low for 6-8 hours (or oven at 300°F/150°C for 4 hours) until fall-apart tender.\n3. Transfer meat to a large cutting board and shred using two forks, discarding excess fat.\n4. Toss shredded pork with warm barbecue sauce until thoroughly coated.\n5. Pile a generous portion of warm pulled pork onto toasted brioche buns.\n6. Top with crunchy coleslaw, cap with top bun, and serve with crispy potato wedges.`,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Hank Williams'
  },
  {
    title: 'Silky Italian Tiramisu Cup',
    description: 'Layers of espresso-soaked Savoiardi ladyfingers and velvety mascarpone cream, generously dusted with Dutch processed cocoa.',
    ingredients: [
      '200g Savoiardi Italian ladyfingers',
      '250g authentic mascarpone cheese',
      '3 large egg yolks',
      '1/3 cup granulated sugar',
      '1 cup heavy whipping cream',
      '1 cup strong brewed espresso, cooled',
      '2 tbsp coffee liqueur or Marsala wine (optional)',
      'Unsweetened Dutch cocoa powder for dusting'
    ],
    instructions: `1. In a heatproof bowl set over simmering water, whisk egg yolks and sugar for 5 minutes until pale and creamy. Let cool.\n2. Beat mascarpone cheese into the egg yolk mixture until smooth.\n3. In a separate bowl, whip heavy cream to medium-stiff peaks, then gently fold into the mascarpone cream.\n4. Mix cooled espresso with coffee liqueur in a shallow dish.\n5. Quickly dip each ladyfinger into espresso for 1-2 seconds (do not over-soak) and layer in serving dish or dessert glasses.\n6. Spread half of the mascarpone cream over ladyfingers. Repeat with another layer of dipped ladyfingers and cream.\n7. Refrigerate for at least 4 hours (or overnight). Dust heavily with cocoa powder right before serving.`,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Francesca Bianchi'
  },
  {
    title: 'Loaded Tex-Mex Beef Enchiladas',
    description: 'Warm corn tortillas rolled with seasoned ground beef and black beans, covered in rich red enchilada sauce and melted Monterey Jack cheese.',
    ingredients: [
      '8 corn tortillas',
      '400g ground beef',
      '1 can (400g) black beans, rinsed',
      '2 cups red enchilada sauce',
      '2 cups shredded Monterey Jack and cheddar cheese',
      '1 packet taco seasoning',
      '1/4 cup chopped green onions',
      'Sour cream and jalapeño slices for garnish'
    ],
    instructions: `1. Preheat oven to 375°F (190°C). Spread 1/2 cup enchilada sauce on the bottom of a 9x13-inch baking dish.\n2. Brown ground beef in a skillet, drain excess grease, and stir in taco seasoning, black beans, and 1/4 cup water. Simmer for 3 minutes.\n3. Warm tortillas for 20 seconds so they do not tear when rolled.\n4. Fill each tortilla with seasoned beef mixture and a sprinkle of cheese. Roll tightly and place seam-side down in the baking dish.\n5. Pour remaining enchilada sauce evenly over the rolled tortillas and top with remaining shredded cheese.\n6. Bake for 20 minutes until cheese is melted and bubbling.\n7. Garnish with chopped green onions, sliced jalapeños, and dollops of sour cream.`,
    imageUrl: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Chef Diego Rivera'
  }
];

/**
 * Seed 20 initial recipes into MongoDB if none exist or force seed
 */
const seedRecipes = async (force = false) => {
  try {
    const existingCount = await Recipe.countDocuments();
    
    if (existingCount === 0 || force) {
      if (force) {
        await Recipe.deleteMany({});
        console.log('[Seed Recipes] Cleared existing recipes for clean re-seed.');
      }

      // Find or assign to default admin user
      const adminUser = await User.findOne({ email: 'iamadmin123@gmail.com' });
      const adminId = adminUser ? adminUser._id : null;

      const formattedRecipes = seedRecipesData.map((r) => ({
        ...r,
        user: adminId,
      }));

      await Recipe.insertMany(formattedRecipes);
      console.log(`=========================================`);
      console.log(`🍲 [Seed Recipes Success] 20 Delicious Recipes Loaded!`);
      console.log(`=========================================`);
    } else {
      console.log(`🍲 [Recipes Ready]: ${existingCount} recipes in database.`);
    }
  } catch (error) {
    console.error('[Seed Recipes Error]:', error.message);
  }
};

module.exports = { seedRecipes, seedRecipesData };

