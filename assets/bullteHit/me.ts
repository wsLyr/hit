import { _decorator, Component, Node, Prefab, Vec2, instantiate, Vec3, Quat, v3 } from 'cc';
import { dir } from 'console';
import { bullte } from './bullte';
import { enemy } from './enemy';
const { ccclass, property } = _decorator;

@ccclass('me')
export class me extends Component {
    @property(bullte)
    bullte:bullte = null;
    @property(enemy)
    enmy:enemy = null;

    _checkCollider:boolean = false;

    newCreateBullte:bullte = null;
    shot(){
        //敌人的初始位置、速度，子弹的位置以及子弹的速度大小
        let enemyPos = this.enmy.node.getWorldPosition();
        let enemyV = this.enmy.getEnemyDir();
        let bulletPos = this.bullte.node.getWorldPosition();
        let bulletV = this.bullte.speed;
        let param:{ canHit: boolean, time: number, dir: Vec3  } = this.calculateAngle(enemyPos, bulletPos, enemyV, bulletV );
        
        if(param.canHit){
            this._checkCollider = true;
            this.bullte.excute(param);
        }
        else{
            console.log("无法击中");
        }
        // param.canHit && (this.newCreateBullte = this.createButtle(param));
    }

    createButtle(param:{ canHit: boolean, time: number, dir: Vec3  }){
        let buttle = instantiate(this.bullte.node).getComponent(bullte);
        buttle.node.parent = this.node;
        buttle.addComponent(bullte).excute(param);
        return buttle;
        // this.calculateAngle(buttle);
    }

    /**
     * 计算角度时间
     * @param enemyPos 敌人位置
     * @param bulletPos 我的位置
     * @param enemyV 敌人的速度方向向量
     * @param bulletV 子弹的速度
     * @returns 
     */
    calculateAngle(enemyPos:Vec3, bulletPos:Vec3, enemyV:Vec3, bulletV: number): { canHit: boolean, time: number, dir: Vec3  }  | null {
        // A相对于B的位置向量
        // let toA = Pa.subtract(Pb);
        let toA = new Vec3();
        Vec3.subtract(toA, enemyPos, bulletPos);

        //A的速度与到A的距离之间的关系
        let vaDotToA = enemyV.dot(toA);

        //计算判别式D
        let D = Math.pow(vaDotToA, 2) - (enemyV.lengthSqr() - bulletV * bulletV) * toA.lengthSqr();
        if(D < 0){
            //如果判别式小于0， 则无实数解，无法击中目标
            return {canHit:false, time:0, dir:Vec3.ZERO};

        }

        let sqrtD = Math.sqrt(D);
        let t1 = (-vaDotToA - sqrtD) / (enemyV.lengthSqr() - bulletV * bulletV);
        let t2 = (-vaDotToA + sqrtD) / (enemyV.lengthSqr() - bulletV * bulletV);

        //时间只能为正
        let t = t1 > 0 ? t1 : (t2 > 0 ? t2 : 0);
        if(t <= 0){
            //如果时间小于等于0，则无法击中目标
            return {canHit:false, time:0, dir:Vec3.ZERO};
        }

        //计算子弹的速度方向
        let targetPosition = enemyPos.clone().add(enemyV.clone().multiplyScalar(t));
        let direction = targetPosition.subtract(bulletPos).normalize();
        let bulletDir = direction.multiplyScalar(bulletV);

        return {canHit:true, time:t, dir:bulletDir};
    }

    btnCallback() {
        this.shot();
    }

    checkCollider(){
        return Vec3.distance(this.enmy.node.worldPosition, this.bullte.node.worldPosition) < 0.3;
    }

    _time = 0;
    update(deltaTime: number) {
        console.table(this.enmy.node.getWorldPosition());
        console.table(this.bullte.node.getWorldPosition());
        console.table(`发射的时间${this._time}`);
        if(this._checkCollider && this.checkCollider()){
            this._time += deltaTime;
            this.enmy.pause();
            this.bullte.pause();
            console.log("发生碰撞");
        }
    }


}


