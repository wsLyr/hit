import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bullte')
export class bullte extends Component {
    @property(Number)
    speed:number = 18;

    dir:Vec3 = new Vec3();

    _isExcute = false;

    excute(param:{ canHit: boolean, time: number, dir: Vec3  }){
        // this.dir = new Vec3(0, param.dirVec, 0);
        this.dir.set(param.dir.x, param.dir.y, param.dir.z).normalize();
        this._isExcute = true;
    }
    pause(){
        this._isExcute = false;
    }

    update(deltaTime: number) {
        if(this._isExcute){
            let pos = this.node.getWorldPosition();
            let dir = this.dir.clone();
            pos.add(dir.multiplyScalar(this.speed * deltaTime));
            // pos.add3f(-0.1, 0, 0.1);
            this.node.setWorldPosition(pos);
        }
    }
}


