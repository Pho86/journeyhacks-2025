import { NextResponse } from 'next/server';

const FOOD_GROUPS = {
    "Fruits": [
        "acorn squash", "apple", "apricot", "banana", "blackberry", "blueberry",
        "boysenberry", "cantaloupe", "cherry", "clementine", "coconut", "cranberry",
        "currant", "date", "dragonfruit", "elderberry", "fig", "goji berry", "gooseberry",
        "grape", "grapefruit", "guava", "honeydew melon", "jackfruit", "jujube", "juniper berry",
        "kiwi fruit", "kumquat", "lemon", "lime", "lychee", "mandarin orange", "mango",
        "mulberry", "nectarine", "orange", "papaya", "passionfruit", "peach", "pear",
        "persimmon", "pineapple", "plum", "pomegranate", "pomelo", "prune", "quince",
        "rambutan", "raspberry", "rhubarb", "star fruit", "strawberry", "tamarind",
        "tangerine", "tomato", "watermelon", "winter melon"
    ],
    "Vegetables": [
        "artichoke", "arugula", "asparagus", "avocado", "bamboo shoots", "basil",
        "bay leaf", "beet", "bell pepper", "bok choy", "broccoli", "brussels sprout",
        "butternut squash", "cabbage", "carrot", "cauliflower", "celery", "chard",
        "chili pepper", "collards", "cucumber", "daikon", "dandelion greens", "eggplant",
        "endive", "fennel", "garlic", "ginger", "green bean", "green onion", "jalapeno",
        "kale", "kohlrabi", "leek", "lettuce", "lotus root", "mushroom", "napa cabbage",
        "okra", "olive", "onion", "parsnip", "pea", "pearl onion", "pepperoni", "potato",
        "pumpkin", "radicchio", "radish", "romaine", "rutabaga", "scallion", "shallot",
        "snow pea", "spinach", "spring onion", "squash", "sweet potato", "swiss chard",
        "tomatillo", "turnip", "water chestnut", "watercress", "yardlong bean", "zucchini"
    ],
    "Grains": [
        "amaranth", "barley", "bread", "bread pudding", "bread rolls", "breadstick",
        "brown rice", "buckwheat", "cereal", "corn", "corn bread", "couscous", "cracker",
        "flour", "fusilli", "granola", "macaroni", "millet", "muesli", "noodle", "oat",
        "oatmeal", "pasta", "penne", "pho", "polenta", "quinoa", "ramen", "rice",
        "risotto", "soda bread", "sorghum", "spaghetti", "vermicelli"
    ],
    "Dairy": [
        "blue cheese", "brie", "butter", "camembert", "cheddar", "cheese", "cottage cheese",
        "creme brulee", "custard", "feta", "gorgonzola", "gouda", "goat cheese",
        "ice cream", "mozzarella", "mousse", "parmesan", "ricotta", "swiss cheese",
        "whipped cream", "yogurt"
    ],
    "Meat": [
        "baby back ribs", "bacon", "beef", "beef carpaccio", "beef steak", "beef tartare",
        "brisket", "chicken", "chicken breast", "chicken curry", "chicken leg",
        "chicken wings", "duck", "filet mignon", "ground beef", "ham", "hamburger",
        "hot dog", "lamb", "lamb chops", "meat", "meatball", "meatloaf", "mutton",
        "pastrami", "pork", "pork chop", "prime rib", "prosciutto", "roast beef",
        "salami", "sausage", "short ribs", "sirloin", "steak", "tenderloin", "turkey",
        "turkey breast", "venison"
    ],
    "Seafood": [
        "anchovy", "bass", "bream", "carp", "clam", "crab", "crayfish", "eel", "fish",
        "fish and chips", "halibut", "herring", "kingfish", "lobster", "mackerel",
        "mussel", "octopus", "oyster", "perch", "pike", "salmon", "sardine", "scallop",
        "sea bass", "shrimp", "snapper", "sole", "squid", "sushi", "trout", "tuna"
    ],
    "Nuts Seeds": [
        "almond", "cashew", "chestnut", "hazelnut", "macadamia nut", "peanut", "pecan",
        "pine nut", "pistachio", "poppy seed", "sesame seed", "sunflower seeds", "walnut"
    ],
    "Legumes": [
        "black beans", "broad beans", "chickpeas", "common bean", "edamame", "fava beans",
        "kidney bean", "lentil", "lima bean", "mung bean", "split peas"
    ],
    "Desserts": [
        "apple pie", "baked alaska", "baklava", "beignets", "birthday cake", "biscuits",
        "brownie", "cake", "cake pop", "candy", "candy apple", "cannoli", "cheesecake",
        "chocolate", "churros", "cobbler", "cookie", "cupcake", "danish pastry",
        "doughnut", "eclair", "fudge", "gelato", "macaron", "macaroon", "marshmallow",
        "meringue", "mochi", "pancake", "parfait", "pie", "popsicle", "pudding", "red velvet cake",
        "scone", "sorbet", "souffle", "strudel", "sundae", "tart", "tiramisu", "waffle", "whoopie pie"
    ],
    "Breads Pastries": [
        "bagel", "baguette", "brioche", "ciabatta", "crescent roll", "croissant",
        "focaccia", "french bread", "garlic bread", "naan", "pita bread", "popovers",
        "ribbon-cut pasta", "tortilla chips"
    ],
    "Drinks": [
        "maple syrup"
    ],
    "Condiments": [
        "aspic", "caper", "chutney", "compote", "hummus", "kombu", "miso soup", "pate",
        "pickles", "relish", "salsa", "sauerkraut", "tofu"
    ],
    "Prepared Foods": [
        "beancurd", "caviar", "dough", "fondue", "frankfurters", "goulash", "hash", "lox", "sprouts", "stuffing"
    ]
};

const FODMAP_CATEGORIES = {
    "High FODMAP": [
        "apple", "apricot", "blackberry", "boysenberry", "cherry", "coconut", "dates",
        "dragonfruit", "fig", "goji berry", "grape", "mango", "nectarine", "peach",
        "pear", "persimmon", "plum", "pomegranate", "prune", "rambutan", "watermelon",
        "asparagus", "artichoke", "beet", "broccoli", "brussels sprout", "butternut squash",
        "cabbage", "cauliflower", "celery", "chicory root", "fennel", "garlic", "green bean",
        "leek", "mushroom", "onion", "pearl onion", "scallion", "shallot", "snow pea",
        "sweet potato", "water chestnut", "barley", "black beans", "broad beans",
        "chickpeas", "common bean", "fava beans", "kidney bean", "lentil", "mung bean",
        "split peas", "pistachio", "cashew", "wheat-based bread", "pasta", "noodle",
        "soft cheese (brie, camembert, cream cheese, ricotta)", "ice cream", "custard",
        "sorbet", "cake", "biscuits", "waffle", "scone", "brownie", "pastries", "pudding",
        "cheesecake", "popsicle", "marshmallow", "honey", "maple syrup"
    ],
    "Moderate FODMAP": [
        "banana (ripe)", "blueberry", "boysenberry", "cantaloupe", "kiwi fruit", "orange",
        "papaya", "passionfruit", "raspberry", "strawberry", "zucchini", "sweet corn",
        "carrot", "eggplant", "okra", "parsnip", "pumpkin", "radish", "turnip", "spinach",
        "quinoa", "oat", "sorghum", "spaghetti", "macaroni", "parmesan", "cheddar", "gorgonzola",
        "gouda", "mozzarella", "swiss cheese", "hard cheeses", "feta (small amounts)", "almond",
        "pecan", "walnut", "peanut", "sesame seed", "sunflower seeds", "sourdough bread",
        "tortilla", "dark chocolate", "sherbet", "macaron", "gelato (lactose-free)"
    ],
    "Low FODMAP": [
        "acorn squash", "clementine", "cranberry", "currant", "elderberry", "grapefruit",
        "honeydew melon", "jackfruit", "jujube", "juniper berry", "kumquat", "lemon", "lime",
        "lychee", "mandarin orange", "tangerine", "tomato", "winter melon", "arugula", "bamboo shoots",
        "basil", "bay leaf", "bell pepper", "bok choy", "chard", "chili pepper", "collards",
        "cucumber", "daikon", "dandelion greens", "endive", "ginger", "jalapeno", "kale",
        "kohlrabi", "lettuce", "lotus root", "mustard greens", "napa cabbage", "olive", "pea",
        "potato", "radicchio", "romaine", "rutabaga", "swiss chard", "tomatillo", "watercress",
        "yardlong bean", "amaranth", "buckwheat", "corn", "corn bread", "couscous", "cracker",
        "millet", "muesli", "pho", "polenta", "rice", "risotto", "soda bread", "vermicelli",
        "hard cheese (aged cheeses)", "butter", "cream (small amounts)", "yogurt (lactose-free)",
        "beef", "chicken", "duck", "lamb", "meatball", "pork", "steak", "turkey", "venison",
        "anchovy", "bass", "bream", "carp", "clam", "crab", "crayfish", "eel", "halibut",
        "herring", "kingfish", "lobster", "mackerel", "mussel", "octopus", "oyster", "perch",
        "pike", "salmon", "sardine", "scallop", "sea bass", "shrimp", "snapper", "sole", "squid",
        "trout", "tuna", "chia seeds", "pine nut", "popcorn", "tahini", "tofu (firm)", "bagel",
        "baguette", "brioche", "ciabatta", "croissant", "naan", "pita bread", "ribbon-cut pasta"
    ]
};

const USDA_CATEGORIES = {
    "Milk": [
        "butter", "brie", "cheddar cheese", "cheese", "cottage cheese", "creme brulee",
        "custard", "frozen yogurt", "goats cheese", "gorgonzola", "gouda", "ice cream",
        "mozzarella", "panna cotta", "parmesan", "pudding", "roquefort", "sherbet",
        "souffle", "swiss cheese", "whipped cream", "yogurt"
    ],
    "Eggs": [
        "deviled eggs", "egg", "egg white", "egg yolk", "frittata", "fried egg",
        "huevos rancheros", "omelette", "quiche"
    ],
    "Fish": [
        "anchovy", "bass", "carp", "ceviche", "cod", "eel", "fish", "fish and chips",
        "filet mignon", "fillet of sole", "flatfish", "herring", "kingfish", "kipper",
        "lox", "mackerel", "perch", "pike", "roe", "salmon", "sardine", "sea bass",
        "smoked fish", "snapper", "sturgeon", "swordfish", "tilapia", "trout",
        "tuna", "tuna tartare"
    ],
    "Crustacean Shellfish": [
        "clam", "cockle", "crab", "crayfish", "lobster", "mussel", "oyster",
        "prawn", "scallop", "shrimp", "squid"
    ],
    "Tree Nuts": [
        "almond", "cashew", "hazelnut", "macadamia nut", "pecan", "pistachio", "walnut"
    ],
    "Peanuts": [
        "peanut"
    ],
    "Wheat": [
        "bagel", "baguette", "baked alaska", "baklava", "barley", "beignet", "biscuits",
        "bread", "bread pudding", "bread roll", "breadfruit", "breadstick", "brioche",
        "brown rice", "brownie", "bruschetta", "buckwheat", "burrito", "cake", "cake pop",
        "cannoli", "cereal", "churros", "ciabatta", "cinnamon roll", "cookie", "corn bread",
        "cornflakes", "couscous", "cracker", "croissant", "crouton", "danish pastry", "doughnut",
        "dough", "eclaire", "english muffin", "falafel", "farfalle", "flatbread", "focaccia",
        "galette", "gnocchi", "granola", "grissini", "knish", "lasagne", "loaf", "macaron",
        "macaroni", "marzipan", "matzah", "muffin", "noodle", "naan", "oat", "oatmeal",
        "pancake", "pasta", "pastry", "penne", "pie", "pita bread", "pizza", "polenta",
        "popcorn", "popover", "porridge", "pretzel", "ramen", "ravioli", "ribbon-cut pasta",
        "rice", "risotto", "roll", "samosa", "sandwich", "sausage roll", "scones", "soda bread",
        "sorghum", "spaghetti", "spaghetti bolognese", "spaghetti carbonara", "spring roll",
        "strudel", "tabouli", "tagliatelle", "tamale", "tempura", "toast", "tortilla",
        "tortilla chip", "vermicelli", "wafer", "waffle", "whoopie pie"
    ],
    "Soybeans": [
        "bean curd", "edamame", "miso soup", "mung bean", "soy milk", "tempeh", "tofu"
    ],
    "Sesame": [
        "sesame seed", "tahini"
    ],
    "None": [
        "acorn squash", "amaranth", "antipasto", "apple", "apple pie", "apple sauce",
        "apricot", "artichoke", "arugula", "asparagus", "aspic", "avocado", "baby back ribs",
        "bacon", "bamboo shoots", "banana", "basil", "bay leaf", "beans", "beef",
        "beef carpaccio", "beef steak", "beef tartare", "beet", "beet salad", "bell pepper",
        "berry", "bibimbap", "bilberry", "birthday cake", "bitter melon", "black bean",
        "black currant", "blackberry", "blood orange", "blood sausage", "blue cheese",
        "blueberry", "blueberry pie", "bok choy", "bonbon", "boysenberry", "broccoli",
        "broccolini", "brulee", "burdock", "cabbage", "caesar salad", "camembert",
        "canape", "candy", "candy apple", "candy bar", "cantaloupe", "caper", "caprese salad",
        "caramel apple", "cardoon", "carpaccio", "carrot", "carrot cake", "cassava", "casserole",
        "cauliflower", "caviar", "celery", "cherry", "cherry tomato", "chestnut", "chicken",
        "chicken breast", "chicken curry", "chicken leg", "chicken wings", "chickpeas", "chili",
        "chili pepper", "chips", "chives", "chocolate", "chorizo", "chowder", "chutney",
        "citron", "citrus", "clementine", "cobbler", "coleslaw", "collard", "common bean",
        "compote", "corn", "corn salad", "corned beef", "cranberry", "crepe", "crescent roll",
        "cress", "crispbread", "croque madame", "croquette", "crunch", "cucumber", "cupcake",
        "curd", "currant", "cuttlefish", "daikon", "dandelion greens", "date", "dragonfruit",
        "dried apricot", "dried fruit", "duck", "dumpling", "durian", "eggplant", "elderberry",
        "endive", "escargots", "fava bean", "fiddlehead", "fig", "foie gras", "fondue",
        "frankfurter", "french bean", "french bread", "french fries", "french onion soup",
        "french toast", "fried calamari", "fried rice", "fritatta", "fritter", "fruit salad",
        "fruitcake", "fudge", "fusilli", "garlic", "garlic bread", "garlic chives", "gazpacho",
        "gherkin", "ginger", "goji berry", "goose", "gooseberry", "gourd", "grape", "grapefruit",
        "greek salad", "green bean", "green onion", "grilled cheese sandwich", "grits",
        "ground beef", "guacamole", "guava", "gyros", "habanero pepper", "halibut", "ham",
        "hamburger", "hash", "honeydew melon", "hot dog", "huckleberry", "hummus", "iceberg lettuce",
        "jackfruit", "jalapeno", "jelly bean", "kale", "kebab"
    ]
}

const sensitivities = {
    lactose: [
        "butter", "brie", "cheddar cheese", "cottage cheese", "creme brulee",
        "custard", "ice cream", "milk", "mozzarella", "panna cotta",
        "parmesan", "pudding", "roquefort", "sherbet", "swiss cheese", 
        "whipped cream", "yogurt"
    ],
    gluten: [
        "bagel", "baguette", "baklava", "barley", "beignet", "biscuits",
        "bread", "bread roll", "breadstick", "brioche", "cake", "cannoli",
        "cereal", "churros", "ciabatta", "cinnamon roll", "cookie",
        "cornflakes", "couscous", "cracker", "croissant", "crouton",
        "danish pastry", "doughnut", "eclaire", "english muffin", "farfalle",
        "flatbread", "focaccia", "galette", "gnocchi", "grissini", "knish",
        "lasagne", "loaf", "macaron", "macaroni", "matzah", "muffin",
        "noodle", "naan", "pasta", "pastry", "penne", "pie", "pita bread",
        "pizza", "popover", "pretzel", "ramen", "ravioli", "ribbon-cut pasta",
        "roll", "samosa", "sandwich", "sausage roll", "scones", "spaghetti",
        "strudel", "tabouli", "tagliatelle", "tempura", "toast", "tortilla",
        "tortilla chip", "vermicelli", "wafer", "waffle", "whoopie pie"
    ]
};


export async function POST(request: Request) {
  try {
    const { foods, type } = await request.json();
    
    const foodCategories = type === 'fodmap' ? FODMAP_CATEGORIES : type === 'usda' ? USDA_CATEGORIES : type === 'sensitivities' ? sensitivities : FOOD_GROUPS;
    
    const analysis = Object.entries(foodCategories).map(([group, items]) => {
      const matches = foods.filter((food: string) => 
        items.some(item => food.toLowerCase().includes(item))
      );
      
      return {
        group,
        percentage: (matches.length / foods.length) * 100,
        matches: matches
      };
    });

    const triggers = analysis.filter(a => a.percentage > 20);
    
      let suggestion = 'No significant food patterns detected.';
      if (triggers.length > 0) {
          if (type === 'fodmap' && FODMAP_CATEGORIES) {
              const highFodmapTrigger = triggers.find(t => t.group === 'high');
              const mediumFodmapTrigger = triggers.find(t => t.group === 'medium');

              if (highFodmapTrigger || mediumFodmapTrigger) {
                  const highestTrigger = triggers.reduce((max, current) =>
                      current.percentage > max.percentage ? current : max
                  );
                  suggestion = `Warning: Your meal appears to be high in FODMAPs, especially ${highestTrigger.group} (${highestTrigger.percentage.toFixed(1)}%). Consider reducing these ingredients if you experience digestive issues.`;
              } else {
                  suggestion = `Great news! Your meal contains only low FODMAP foods. This is ideal for sensitive digestion and should be very gentle on your stomach.`;
              }
          } else if (type === 'sensitivities' && sensitivities) {
              const sensitivityWarnings = triggers.map(t =>
                  `${t.group} (${t.percentage.toFixed(1)}% of ingredients)`
              );
              suggestion = `Warning: This recipe contains common allergens/sensitivities: ${sensitivityWarnings.join(', ')}. Consider alternatives if you have known sensitivities.`;
          } else if (type === 'usda' && USDA_CATEGORIES) {
              // Filter out triggers with the group 'none'
              const filteredTriggers = triggers.filter(t => t.group !== 'none');

              if (filteredTriggers.length > 0) {
                  // Join the groups, ensuring 'none' is not included
                  const triggerGroups = filteredTriggers.map(t => t.group).filter(group => group !== 'None').join(', ');
                  suggestion = `Consider reducing ${triggerGroups ? triggerGroups : 'food'} for two weeks to identify sensitivities.`;
              } else {
                  suggestion = `No significant food patterns detected for USDA analysis.`;
              }
          } else {
              suggestion = `Analysis type not recognized or categories not defined.`;
          }}
    return NextResponse.json({
      analysis,
      triggers,
      suggestion
    });
  } catch (error) {
    console.error('Error analyzing foods:', error);
    return NextResponse.json({ error: 'Failed to analyze foods' }, { status: 500 });
  }
}
