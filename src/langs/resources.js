import en from '../langs/en.json';
import fr from '../langs/fr.json';

const langs = { fr, en };
let resources = {}
Object.keys(langs).map((key) => {
    resources[key] = { translation: langs[key] }
})

export default resources;