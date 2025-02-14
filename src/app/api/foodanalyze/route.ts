import { NextResponse } from 'next/server';

const FOOD_GROUPS = {
  dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ice cream', 'whey', 'casein', 'cottage cheese', 'sour cream', 'ghee', 'kefir', 'ricotta'],
  gluten: ['wheat', 'bread', 'pasta', 'cereal', 'flour', 'rye', 'barley', 'couscous', 'semolina', 'spelt', 'graham', 'bulgur', 'farro', 'seitan', 'malt'],
  nuts: ['peanut', 'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'macadamia', 'brazil nut', 'pine nut', 'hazelnut', 'chestnut'],
  seafood: ['fish', 'shrimp', 'crab', 'lobster', 'shellfish', 'tuna', 'salmon', 'cod', 'halibut', 'tilapia', 'mussels', 'clams', 'oysters', 'scallops', 'anchovy', 'sardines'],
  soy: ['soybean', 'tofu', 'soy sauce', 'edamame', 'miso', 'tempeh', 'natto', 'tamari', 'textured vegetable protein', 'soy milk', 'soy lecithin'],
  eggs: ['egg', 'albumin', 'mayonnaise', 'meringue', 'egg white', 'egg yolk'],
  nightshades: ['tomato', 'potato', 'eggplant', 'pepper', 'paprika', 'cayenne', 'goji berry'],
  shellfish: ['shrimp', 'crab', 'lobster', 'crayfish', 'prawn', 'langoustine', 'scampi'],
  tree_nuts: ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'macadamia', 'brazil nut', 'hazelnut'],
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

