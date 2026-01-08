import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

/* ======= SCENE ======= */
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 50, 400);
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 2000);
camera.position.set(0,20,0);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(200, 300, 200);
scene.add(sun);

/* ======= POSTPROCESSING ======= */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.15, 1, 0.05);
composer.addPass(bloomPass);

/* ======= CONSTANTS & MATERIALS ======= */
const CHUNK_SIZE = 16, RENDER_DISTANCE = 3;
const blockGeo = new THREE.BoxGeometry(1,1,1);
const grassMat = new THREE.MeshStandardMaterial({color:0x3ba635, roughness:0.6});
const dirtMat = new THREE.MeshStandardMaterial({color:0x8b5a2b, roughness:0.6});
const stoneMat = new THREE.MeshStandardMaterial({color:0x777777, roughness:0.8});
const woodMat = new THREE.MeshStandardMaterial({color:0x8b4513, roughness:0.7});
const roofMat = new THREE.MeshStandardMaterial({color:0x991a00, roughness:0.7});
const doorMat = new THREE.MeshStandardMaterial({color:0xffff00, roughness:0.6});
const villagerMat = new THREE.MeshStandardMaterial({color:0x00ffff, roughness:0.6});
const fenceMat = new THREE.MeshStandardMaterial({color:0x654321, roughness:0.8});
const treeTrunkMat = new THREE.MeshStandardMaterial({color:0x8b4513, roughness:0.8});
const treeLeavesMat = new THREE.MeshStandardMaterial({color:0x228b22, roughness:0.7});
const pathMat = new THREE.MeshStandardMaterial({color:0xaaaaaa, roughness:0.9});

/* ======= CAMERA CONTROL ======= */
let yaw=0, pitch=0, speed=0.25;
const keys = {};
addEventListener("keydown", e=>keys[e.code]=true);
addEventListener("keyup", e=>keys[e.code]=false);
document.body.addEventListener("click", ()=>document.body.requestPointerLock());
addEventListener("mousemove", e=>{
  if(document.pointerLockElement===document.body){
    yaw -= e.movementX*0.002;
    pitch -= e.movementY*0.002;
    pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
  }
});

/* ======= TERRAIN ======= */
const chunks = new Map();
function chunkKey(cx,cz){return `${cx},${cz}`;}
function heightAt(x,z){return Math.floor(Math.sin(x*0.02)*8 + Math.cos(z*0.02)*8 + Math.sin((x+z)*0.05)*4);}

function generateChunk(cx,cz){
  const chunk={group:new THREE.Group(), instancedMeshes:{}};
  let counts={grass:0,dirt:0,stone:0};
  for(let x=0;x<CHUNK_SIZE;x++){
    for(let z=0;z<CHUNK_SIZE;z++){
      const wx=cx*CHUNK_SIZE+x;
      const wz=cz*CHUNK_SIZE+z;
      const h=heightAt(wx,wz);
      for(let y=-4;y<=h;y++){
        const mat = y===h?"grass":y>=h-2?"dirt":"stone";
        counts[mat]++;
      }
    }
  }
  for(const matName of ["grass","dirt","stone"]){
    const mat = matName==="grass"?grassMat:matName==="dirt"?dirtMat:stoneMat;
    const inst = new THREE.InstancedMesh(blockGeo, mat, counts[matName]);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    chunk.instancedMeshes[matName]={inst,index:0};
    chunk.group.add(inst);
  }
  for(let x=0;x<CHUNK_SIZE;x++){
    for(let z=0;z<CHUNK_SIZE;z++){
      const wx=cx*CHUNK_SIZE+x;
      const wz=cz*CHUNK_SIZE+z;
      const h=heightAt(wx,wz);
      for(let y=-4;y<=h;y++){
        const matName = y===h?"grass":y>=h-2?"dirt":"stone";
        const instData = chunk.instancedMeshes[matName];
        const dummy = new THREE.Object3D();
        dummy.position.set(wx,y,wz);
        dummy.updateMatrix();
        instData.inst.setMatrixAt(instData.index++, dummy.matrix);
      }
    }
  }
  for(const matName in chunk.instancedMeshes) chunk.instancedMeshes[matName].inst.instanceMatrix.needsUpdate=true;
  scene.add(chunk.group);
  chunks.set(chunkKey(cx,cz),chunk);
  maybeGenerateVillage(cx,cz);
}

/* ======= VILLAGES ======= */
const villages=[];
function maybeGenerateVillage(cx,cz){
  if(Math.random()<0.3){
    const baseX=cx*CHUNK_SIZE+4;
    const baseZ=cz*CHUNK_SIZE+4;
    const baseY=heightAt(baseX,baseZ);

    // Random biome
    const biomes = ["plains","desert","snow"];
    const biome = biomes[Math.floor(Math.random()*biomes.length)];
    let grassColor=0x3ba635, treeColor=0x228b22;
    if(biome==="desert"){grassColor=0xdaa520;treeColor=0x228b22;}
    if(biome==="snow"){grassColor=0xffffff;treeColor=0xddddff;}
    grassMat.color.setHex(grassColor);
    treeLeavesMat.color.setHex(treeColor);

    const village={x:baseX,z:baseZ,y:baseY,houses:[],villagers:[],paths:[],trees:[],fences:[],biome};
    const numHouses=Math.floor(Math.random()*3)+2;
    const housePositions=[];
    for(let i=0;i<numHouses;i++){
      const hx=baseX+Math.floor(Math.random()*6)-3;
      const hz=baseZ+Math.floor(Math.random()*6)-3;
      const hy=heightAt(hx,hz);
      const house = buildHouse(hx,hy,hz);
      housePositions.push({x:hx,y:hy,z:hz,door:{x:hx+1,y:hy,z:hz}});
      village.houses.push(housePositions[i]);
    }
    generatePaths(housePositions,village);
    generateFences(baseX,baseZ,village);
    generateTrees(baseX,baseZ,village);
    spawnVillagers(village,2);
    villages.push(village);
  }
}

/* ======= HOUSES, PATHS, FENCES, TREES, VILLAGERS ======= */
// ... (use the same code as in the upgraded main.js from previous message for houses, paths, fences, trees, villagers)

