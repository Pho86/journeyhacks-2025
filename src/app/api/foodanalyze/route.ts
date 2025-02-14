import { NextResponse } from 'next/server';

const FOOD_GROUPS = {
    Fruits: [
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
    Vegetables: [
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
    Grains: [
        "amaranth", "barley", "bread", "bread pudding", "bread rolls", "breadstick",
        "brown rice", "buckwheat", "cereal", "corn", "corn bread", "couscous", "cracker",
        "flour", "fusilli", "granola", "macaroni", "millet", "muesli", "noodle", "oat",
        "oatmeal", "pasta", "penne", "pho", "polenta", "quinoa", "ramen", "rice",
        "risotto", "soda bread", "sorghum", "spaghetti", "vermicelli"
    ],
    Dairy: [
        "blue cheese", "brie", "butter", "camembert", "cheddar", "cheese", "cottage cheese",
        "creme brulee", "custard", "feta", "gorgonzola", "gouda", "goat cheese",
        "ice cream", "mozzarella", "mousse", "parmesan", "ricotta", "swiss cheese",
        "whipped cream", "yogurt"
    ],
    Meat: [
        "baby back ribs", "bacon", "beef", "beef carpaccio", "beef steak", "beef tartare",
        "brisket", "chicken", "chicken breast", "chicken curry", "chicken leg",
        "chicken wings", "duck", "filet mignon", "ground beef", "ham", "hamburger",
        "hot dog", "lamb", "lamb chops", "meat", "meatball", "meatloaf", "mutton",
        "pastrami", "pork", "pork chop", "prime rib", "prosciutto", "roast beef",
        "salami", "sausage", "short ribs", "sirloin", "steak", "tenderloin", "turkey",
        "turkey breast", "venison"
    ],
    Seafood: [
        "anchovy", "bass", "bream", "carp", "clam", "crab", "crayfish", "eel", "fish",
        "fish and chips", "halibut", "herring", "kingfish", "lobster", "mackerel",
        "mussel", "octopus", "oyster", "perch", "pike", "salmon", "sardine", "scallop",
        "sea bass", "shrimp", "snapper", "sole", "squid", "sushi", "trout", "tuna"
    ],
    Nuts_Seeds: [
        "almond", "cashew", "chestnut", "hazelnut", "macadamia nut", "peanut", "pecan",
        "pine nut", "pistachio", "poppy seed", "sesame seed", "sunflower seeds", "walnut"
    ],
    Legumes: [
        "black beans", "broad beans", "chickpeas", "common bean", "edamame", "fava beans",
        "kidney bean", "lentil", "lima bean", "mung bean", "split peas"
    ],
    Desserts: [
        "apple pie", "baked alaska", "baklava", "beignets", "birthday cake", "biscuits",
        "brownie", "cake", "cake pop", "candy", "candy apple", "cannoli", "cheesecake",
        "chocolate", "churros", "cobbler", "cookie", "cupcake", "danish pastry",
        "doughnut", "eclair", "fudge", "gelato", "macaron", "macaroon", "marshmallow",
        "meringue", "mochi", "pancake", "parfait", "pie", "popsicle", "pudding", "red velvet cake",
        "scone", "sorbet", "souffle", "strudel", "sundae", "tart", "tiramisu", "waffle", "whoopie pie"
    ],
    Miscellaneous: [
        "aspic", "beancurd", "caper", "caviar", "chutney", "compote", "dough", "fondue",
        "frankfurters", "goulash", "hash", "hummus", "kombu", "lox", "miso soup",
        "pate", "pickles", "relish", "salsa", "sauerkraut", "sprouts", "stuffing", "tofu"
    ],
    Breads_Pastries: [
        "bagel", "baguette", "brioche", "ciabatta", "crescent roll", "croissant",
        "focaccia", "french bread", "garlic bread", "naan", "pita bread", "popovers",
        "ribbon-cut pasta", "tortilla chips"
    ],
    Drinks: [
        "maple syrup"
    ]
};


export async function POST(request: Request) {
  try {
    const { foods } = await request.json();
    
    const analysis = Object.entries(FOOD_GROUPS).map(([group, items]) => {
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
    
    return NextResponse.json({
      analysis,
      triggers,
      suggestion: triggers.length > 0 
        ? `Consider reducing ${triggers.map(t => t.group).join(', ')} for two weeks to identify sensitivities.`
        : 'No significant food group patterns detected.'
    });
  } catch (error) {
    console.error('Error analyzing foods:', error);
    return NextResponse.json({ error: 'Failed to analyze foods' }, { status: 500 });
  }
}

