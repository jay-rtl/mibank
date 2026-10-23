import fs from 'node:fs/promises';
const url='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';const r=await fetch(url);if(!r.ok)throw Error('Geography download '+r.status);const data=await r.json();
const names=['Papua New Guinea','Indonesia','Australia','Solomon Islands','Vanuatu','Fiji','New Caledonia','Timor-Leste','Malaysia','Philippines','Micronesia','Palau'];
const features=data.features.filter(f=>names.includes(f.properties.ADMIN)).map(f=>({type:'Feature',properties:{name:f.properties.ADMIN},geometry:f.geometry}));
await fs.writeFile('src/data/map-geography.json',JSON.stringify({type:'FeatureCollection',features}));await fs.writeFile('source/map-geography.json',JSON.stringify({source:url,license:'Public domain — Natural Earth',terms:'https://www.naturalearthdata.com/about/terms-of-use/',selection:names,downloaded:'2026-10-23'},null,2));console.log(features.map(f=>f.properties.name));
