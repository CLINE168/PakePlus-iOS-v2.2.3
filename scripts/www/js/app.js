// 接触网自适应柔性破冰装置 - 智能决策平台
document.addEventListener('DOMContentLoaded', function() {
    // ===== 移动端侧边栏控制 =====
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        menuToggle.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        menuToggle.textContent = '☰';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // 侧边栏导航 - 点击后关闭侧边栏（移动端）
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
            // 移动端点击导航后关闭侧边栏
            closeSidebar();
        });
    });

    // ===== 线路数据 =====
    const routeData = {
        haqi: { name:'哈齐客专', badge:'0-286km', level:'高速铁路', speed:'250 km/h', catenary:'弹性链型悬挂', catenaryH:'5.3 m', structH:'1.6 m', span:'50 m', track:'有砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'15 kN', contactT:'20 kN', difficulty:'★★★☆☆', desc:'哈齐高速铁路连接哈尔滨与齐齐哈尔，是黑龙江省重要的铁路干线，冬季覆冰期长，除冰任务繁重。', stations:['哈尔滨','大庆','齐齐哈尔'] },
        jinghu: { name:'京沪高铁', badge:'0-1318km', level:'高速铁路', speed:'350 km/h', catenary:'简单链型悬挂', catenaryH:'5.3 m', structH:'1.4 m', span:'50 m', track:'无砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'20 kN', contactT:'25 kN', difficulty:'★★☆☆☆', desc:'京沪高速铁路连接北京与上海，是中国最繁忙的高铁线路，南方区段覆冰较少。', stations:['北京','天津','济南','南京','上海'] },
        hada: { name:'哈大客专', badge:'0-921km', level:'高速铁路', speed:'300 km/h', catenary:'弹性链型悬挂', catenaryH:'5.3 m', structH:'1.6 m', span:'50 m', track:'无砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'15 kN', contactT:'20 kN', difficulty:'★★★★☆', desc:'哈大高速铁路连接哈尔滨与大连，穿越东北三省，冬季严寒，除冰难度大。', stations:['哈尔滨','长春','沈阳','大连'] },
        jingzhang: { name:'京张高铁', badge:'0-174km', level:'高速铁路', speed:'350 km/h', catenary:'智能链型悬挂', catenaryH:'5.5 m', structH:'1.5 m', span:'48 m', track:'有砟/无砟混合', rail:'CHN60', gauge:'1435 mm', tension:'18 kN', contactT:'22 kN', difficulty:'★★★☆☆', desc:'京张高速铁路是2022年冬奥会配套工程，智能化程度高，部分区段穿越山区。', stations:['北京','张家口'] },
        chengdu: { name:'西成客专', badge:'0-658km', level:'高速铁路', speed:'250 km/h', catenary:'弹性链型悬挂', catenaryH:'5.3 m', structH:'1.5 m', span:'50 m', track:'无砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'15 kN', contactT:'20 kN', difficulty:'★★★★☆', desc:'西成客运专线穿越秦岭山区，桥隧比高，冬季山区覆冰情况复杂。', stations:['西安','汉中','成都'] },
        guangzhou: { name:'武广高铁', badge:'0-1069km', level:'高速铁路', speed:'350 km/h', catenary:'简单链型悬挂', catenaryH:'5.3 m', structH:'1.4 m', span:'50 m', track:'无砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'20 kN', contactT:'25 kN', difficulty:'★★☆☆☆', desc:'武广高速铁路连接武汉与广州，南方线路覆冰较少，但山区区段偶有冻雨。', stations:['武汉','长沙','广州'] },
        lanxin: { name:'兰新高铁', badge:'0-1776km', level:'高速铁路', speed:'250 km/h', catenary:'弹性链型悬挂', catenaryH:'5.4 m', structH:'1.6 m', span:'50 m', track:'有砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'15 kN', contactT:'20 kN', difficulty:'★★★★★', desc:'兰新高速铁路是中国最长的高铁线路之一，穿越戈壁和雪山，极端天气多。', stations:['兰州','西宁','乌鲁木齐'] },
        shenzhen: { name:'广深港高铁', badge:'0-142km', level:'高速铁路', speed:'350 km/h', catenary:'简单链型悬挂', catenaryH:'5.3 m', structH:'1.4 m', span:'50 m', track:'无砟轨道', rail:'CHN60', gauge:'1435 mm', tension:'20 kN', contactT:'25 kN', difficulty:'★☆☆☆☆', desc:'广深港高速铁路连接广州、深圳与香港，南方沿海线路基本无覆冰风险。', stations:['广州','深圳','香港'] }
    };

    let currentRoute = 'haqi', currentDiagram = 'overview', currentThumb = 'main';

    // ===== Canvas工具函数 =====
    function bg(ctx,w,h){let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0a1628');g.addColorStop(0.5,'#0f1f3a');g.addColorStop(1,'#0a1628');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
    function ttl(ctx,t,w){ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='bold 32px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(t,w/2,50);}
    function zmb(ctx,w,h,l){ctx.strokeStyle='rgba(79,195,247,0.3)';ctx.lineWidth=2;ctx.setLineDash([8,4]);ctx.strokeRect(30,70,w-60,h-140);ctx.setLineDash([]);ctx.fillStyle='rgba(79,195,247,0.5)';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText(l,40,90);}

    // ===== 主视图绘制 =====
    function drawOverview(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);
        ctx.fillStyle='rgba(26,115,232,0.03)';for(let i=0;i<20;i++){let x=Math.random()*c.width,y=280+Math.random()*60;ctx.beginPath();ctx.arc(x,y,20+Math.random()*40,0,Math.PI*2);ctx.fill();}
        const ty=320,sx=60,ex=c.width-60;
        for(let x=sx;x<ex;x+=25){ctx.fillStyle='rgba(45,74,98,0.25)';ctx.fillRect(x,ty-6,16,12);}
        ctx.shadowColor='rgba(74,144,217,0.2)';ctx.shadowBlur=5;
        ctx.beginPath();ctx.moveTo(sx,ty-10);ctx.lineTo(ex,ty-10);ctx.strokeStyle='#4a90d9';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(sx,ty+10);ctx.lineTo(ex,ty+10);ctx.strokeStyle='#4a90d9';ctx.lineWidth=2.5;ctx.stroke();ctx.shadowBlur=0;
        ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(sx,ty);ctx.lineTo(ex,ty);ctx.strokeStyle='rgba(74,144,217,0.2)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
        const pc=7,ps=(ex-sx)/(pc-1);
        for(let i=0;i<pc;i++){let px=sx+i*ps;ctx.fillStyle='#4a6a8a';ctx.shadowColor='rgba(26,115,232,0.2)';ctx.shadowBlur=4;ctx.fillRect(px-2.5,ty-100,5,100);ctx.shadowBlur=0;ctx.fillStyle='#5a7a9a';ctx.fillRect(px-20,ty-105,40,4);ctx.fillStyle='#7a9aaa';ctx.beginPath();ctx.arc(px,ty-105,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.4)';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(px,ty-10,3.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.beginPath();ctx.moveTo(sx,ty-65);ctx.lineTo(ex,ty-65);ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();for(let i=0;i<pc-1;i++){let x1=sx+i*ps,x2=sx+(i+1)*ps,mx=(x1+x2)/2,yo=(i%2===0)?-4:4;ctx.moveTo(x1,ty-10);ctx.lineTo(mx,ty-10+yo);ctx.lineTo(x2,ty-10);}ctx.strokeStyle='#ffa500';ctx.lineWidth=2;ctx.stroke();
        for(let i=0;i<pc;i++){let px=sx+i*ps;ctx.beginPath();ctx.moveTo(px,ty-65);ctx.lineTo(px,ty-10);ctx.strokeStyle='rgba(255,215,0,0.3)';ctx.lineWidth=0.8;ctx.stroke();}
        d.stations.forEach((s,i)=>{let sx2=sx+(ex-sx)*(i+1)/(d.stations.length+1);ctx.fillStyle='#1a3a5a';ctx.fillRect(sx2-12,ty+20,24,16);ctx.fillStyle='#2a5a8a';ctx.beginPath();ctx.moveTo(sx2-15,ty+20);ctx.lineTo(sx2,ty+12);ctx.lineTo(sx2+15,ty+20);ctx.fill();ctx.fillStyle='#e8eaed';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(s,sx2,ty+52);ctx.fillStyle='#34a853';ctx.shadowColor='rgba(52,168,83,0.4)';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(sx2,ty,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
        ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='bold 42px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(d.name,c.width/2,90);
        ctx.fillStyle='#5f6368';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText(d.badge,sx,ty+80);
        const ly=460;const lg=[{c:'#ffd700',l:'承力索'},{c:'#ffa500',l:'接触线'},{c:'#4a90d9',l:'钢轨'},{c:'#34a853',l:'车站'}];
        lg.forEach((l,i)=>{let lx=30+i*150;ctx.fillStyle=l.c;ctx.fillRect(lx,ly,18,3);ctx.fillStyle='#9aa0a6';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText(l.l,lx+24,ly+4);});
    }

    function drawCatenary(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);
        ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='bold 36px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(d.name+' 接触网结构',c.width/2,60);
        const bx=100,by=180,sw=200;
        for(let s=0;s<3;s++){let sx=bx+s*sw;ctx.fillStyle='#5a7a9a';ctx.shadowColor='rgba(26,115,232,0.2)';ctx.shadowBlur=3;ctx.fillRect(sx-4,by-140,8,180);ctx.shadowBlur=0;ctx.fillStyle='#6a8aaa';ctx.fillRect(sx-30,by-145,60,5);ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(sx,by-145,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6a8aaa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx,by-145);ctx.lineTo(sx+40,by-100);ctx.stroke();ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(sx,by-10,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.beginPath();ctx.moveTo(bx,by-100);for(let x=bx;x<=bx+2*sw;x+=5){let y=by-100+Math.sin((x-bx)/sw*Math.PI*2)*5;ctx.lineTo(x,y);}ctx.strokeStyle='#ffd700';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx,by-10);for(let x=bx;x<=bx+2*sw;x+=5){let y=by-10+Math.sin((x-bx)/(sw/2)*Math.PI*2)*3;ctx.lineTo(x,y);}ctx.strokeStyle='#ffa500';ctx.lineWidth=3;ctx.stroke();
        for(let s=0;s<3;s++){let sx=bx+s*sw;ctx.beginPath();ctx.moveTo(sx,by-100);ctx.lineTo(sx,by-10);ctx.strokeStyle='rgba(255,215,0,0.5)';ctx.lineWidth=1.5;ctx.stroke();for(let j=1;j<=3;j++){let ax=sx+(sw/4)*j;ctx.beginPath();ctx.moveTo(ax,by-100+Math.sin((ax-bx)/sw*Math.PI*2)*5);ctx.lineTo(ax,by-10+Math.sin((ax-bx)/(sw/2)*Math.PI*2)*3);ctx.strokeStyle='rgba(255,215,0,0.2)';ctx.lineWidth=0.8;ctx.stroke();}}
        ctx.fillStyle='#4fc3f7';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('承力索',bx+sw,by-115);ctx.fillText('接触线',bx+sw,by+15);ctx.fillText('吊弦',bx+sw/2,by-55);ctx.fillText('支柱',bx,by+50);ctx.fillText('支柱',bx+sw,by+50);ctx.fillText('支柱',bx+2*sw,by+50);
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.fillText('← '+d.span+' →',bx+sw/2,by+75);ctx.fillText('← '+d.span+' →',bx+sw+sw/2,by+75);
        ctx.fillStyle='#9aa0a6';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('接触网类型: '+d.catenary,30,420);ctx.fillText('结构高度: '+d.structH,30,440);ctx.fillText('接触网高度: '+d.catenaryH,30,460);ctx.fillText('承力索张力: '+d.tension,350,420);ctx.fillText('接触线张力: '+d.contactT,350,440);ctx.fillText('跨距: '+d.span,350,460);
    }

    function drawCrossSection(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);
        ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='bold 36px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(d.name+' 横截面',c.width/2,55);
        const cx=c.width/2,cy=c.height/2+20;
        ctx.fillStyle='#1a2d3d';ctx.fillRect(0,cy+60,c.width,120);ctx.fillStyle='#0f1923';ctx.fillRect(0,cy+60,c.width,3);
        ctx.fillStyle='#2a3d4d';ctx.beginPath();ctx.moveTo(cx-160,cy+60);ctx.lineTo(cx-140,cy+40);ctx.lineTo(cx+140,cy+40);ctx.lineTo(cx+160,cy+60);ctx.fill();
        for(let i=-3;i<=3;i++){ctx.fillStyle='#3a4d5d';ctx.fillRect(cx+i*35-4,cy+30,8,30);}
        ctx.fillStyle='#7a8a9a';ctx.shadowColor='rgba(122,138,154,0.3)';ctx.shadowBlur=4;ctx.fillRect(cx-80,cy+15,12,25);ctx.fillRect(cx-82,cy+15,16,5);ctx.fillRect(cx+68,cy+15,12,25);ctx.fillRect(cx+66,cy+15,16,5);ctx.shadowBlur=0;
        ctx.fillStyle='#4fc3f7';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('← '+d.gauge+' →',cx,cy+10);
        ctx.fillStyle='#5a7a9a';ctx.fillRect(cx-120,cy-120,8,180);ctx.fillRect(cx+112,cy-120,8,180);ctx.fillStyle='#6a8aaa';ctx.fillRect(cx-130,cy-125,260,6);
        ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(cx-116,cy-125,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+116,cy-125,6,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(cx,cy-100,3,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,cy-100);ctx.lineTo(cx,cy-20);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#ffa500';ctx.fillRect(cx-60,cy-22,120,4);
        ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-50,cy-20);ctx.lineTo(cx-30,cy-35);ctx.lineTo(cx+30,cy-35);ctx.lineTo(cx+50,cy-20);ctx.stroke();ctx.fillStyle='#4fc3f7';ctx.fillRect(cx-35,cy-38,70,4);
        ctx.fillStyle='#4fc3f7';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('接触线',cx,cy-35);ctx.fillText('承力索',cx,cy-110);ctx.fillText('受电弓',cx+80,cy-30);ctx.fillText('钢轨',cx-80,cy+55);ctx.fillText('轨枕',cx,cy+55);
        ctx.fillStyle='#5f6368';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('接触网高度: '+d.catenaryH,30,420);ctx.fillText('结构高度: '+d.structH,30,440);ctx.fillText('钢轨型号: '+d.rail,30,460);ctx.fillText('轨道类型: '+d.track,350,420);ctx.fillText('轨距: '+d.gauge,350,440);
    }

    function drawIceSection(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);
        ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='bold 36px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(d.name+' 覆冰区段分布',c.width/2,55);
        const sx=80,ex=c.width-80,ly=200;
        ctx.fillStyle='rgba(26,115,232,0.05)';ctx.fillRect(sx-10,ly-30,ex-sx+20,60);
        ctx.beginPath();ctx.moveTo(sx,ly);for(let x=sx;x<=ex;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y);}ctx.strokeStyle='#4a90d9';ctx.lineWidth=4;ctx.stroke();
        const iceSegments=[];let segCount=d.difficulty.length>=4?4:3;
        for(let i=0;i<segCount;i++){iceSegments.push({start:sx+(ex-sx)*(0.1+Math.random()*0.6),end:sx+(ex-sx)*(0.1+Math.random()*0.6)+(ex-sx)*(0.08+Math.random()*0.15),level:Math.floor(Math.random()*3)+1});}
        iceSegments.forEach(seg=>{const cs=['rgba(144,202,249,0.3)','rgba(255,183,77,0.4)','rgba(239,83,80,0.5)'],bs=['#90caf9','#ffb74d','#ef5350'];
        ctx.fillStyle=cs[seg.level-1];ctx.beginPath();ctx.moveTo(seg.start,ly-25);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y-25);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y+25);}ctx.closePath();ctx.fill();
        ctx.strokeStyle=bs[seg.level-1];ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(seg.start,ly-25);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y-25);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y+25);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);
        let mx=(seg.start+seg.end)/2,my=ly+Math.sin((mx-sx)/200*Math.PI*2)*15;ctx.fillStyle=bs[seg.level-1];ctx.font='bold 11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(seg.level+'级覆冰',mx,my-35);});
        const legY=420;const iceLegends=[{c:'#90caf9',l:'1级覆冰（轻度）'},{c:'#ffb74d',l:'2级覆冰（中度）'},{c:'#ef5350',l:'3级覆冰（重度）'}];
        iceLegends.forEach((l,i)=>{let lx=30+i*200;ctx.fillStyle=l.c;ctx.fillRect(lx,legY,16,3);ctx.fillStyle='#9aa0a6';ctx.fillText(l.l,lx+22,legY+4);});
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('除冰难度: '+d.difficulty,30,460);ctx.fillText('线路全长: '+d.badge,350,460);ctx.fillText('接触网类型: '+d.catenary,30,480);ctx.fillText('设计时速: '+d.speed,350,480);
    }

    // ===== 局部放大视图 =====
    function drawDetailOverview(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 线路总览放大',c.width);zmb(ctx,c.width,c.height,'🔍 放大区域 (1.5×)');
        const ty=280,sx=60,ex=c.width-60;
        for(let x=sx;x<ex;x+=20){ctx.fillStyle='rgba(45,74,98,0.3)';ctx.fillRect(x,ty-8,14,16);}
        ctx.shadowColor='rgba(74,144,217,0.3)';ctx.shadowBlur=8;
        ctx.beginPath();ctx.moveTo(sx,ty-14);ctx.lineTo(ex,ty-14);ctx.strokeStyle='#4a90d9';ctx.lineWidth=3.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(sx,ty+14);ctx.lineTo(ex,ty+14);ctx.strokeStyle='#4a90d9';ctx.lineWidth=3.5;ctx.stroke();ctx.shadowBlur=0;
        const pc=5,ps=(ex-sx)/(pc-1);
        for(let i=0;i<pc;i++){let px=sx+i*ps;ctx.fillStyle='#4a6a8a';ctx.shadowColor='rgba(26,115,232,0.3)';ctx.shadowBlur=6;ctx.fillRect(px-3,ty-130,6,130);ctx.shadowBlur=0;ctx.fillStyle='#5a7a9a';ctx.fillRect(px-25,ty-135,50,5);ctx.fillStyle='#7a9aaa';ctx.beginPath();ctx.arc(px,ty-135,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(px,ty-14,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.beginPath();ctx.moveTo(sx,ty-85);ctx.lineTo(ex,ty-85);ctx.strokeStyle='#ffd700';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();for(let i=0;i<pc-1;i++){let x1=sx+i*ps,x2=sx+(i+1)*ps,mx=(x1+x2)/2,yo=(i%2===0)?-6:6;ctx.moveTo(x1,ty-14);ctx.lineTo(mx,ty-14+yo);ctx.lineTo(x2,ty-14);}ctx.strokeStyle='#ffa500';ctx.lineWidth=3;ctx.stroke();
        d.stations.forEach((s,i)=>{let sx2=sx+(ex-sx)*(i+1)/(d.stations.length+1);ctx.fillStyle='#1a3a5a';ctx.fillRect(sx2-16,ty+25,32,20);ctx.fillStyle='#2a5a8a';ctx.beginPath();ctx.moveTo(sx2-20,ty+25);ctx.lineTo(sx2,ty+15);ctx.lineTo(sx2+20,ty+25);ctx.fill();ctx.fillStyle='#e8eaed';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(s,sx2,ty+62);ctx.fillStyle='#34a853';ctx.shadowColor='rgba(52,168,83,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(sx2,ty,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('线路: '+d.name+' | '+d.badge+' | '+d.level+' | '+d.speed,40,c.height-30);
        ctx.fillStyle='rgba(79,195,247,0.6)';ctx.textAlign='right';ctx.fillText('放大倍率: 1.5×',c.width-40,c.height-30);
    }

    function drawDetailCatenary(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 接触网结构放大',c.width);zmb(ctx,c.width,c.height,'🔍 放大区域 (2×)');
        const ox=30,oy=100;
        ctx.fillStyle='#5a7a9a';ctx.shadowColor='rgba(26,115,232,0.3)';ctx.shadowBlur=5;ctx.fillRect(ox+80,oy+20,14,220);ctx.shadowBlur=0;
        ctx.fillStyle='#6a8aaa';ctx.fillRect(ox+30,oy+15,114,8);
        ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(ox+87,oy+15,12,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#6a8aaa';ctx.lineWidth=1;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.arc(ox+87,oy+15+i*5,9,0,Math.PI*2);ctx.stroke();}
        ctx.strokeStyle='#6a8aaa';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(ox+87,oy+15);ctx.lineTo(ox+200,oy+65);ctx.stroke();
        ctx.beginPath();ctx.moveTo(ox+30,oy+55);ctx.quadraticCurveTo(ox+220,oy+30,ox+450,oy+60);ctx.strokeStyle='#ffd700';ctx.lineWidth=4;ctx.shadowColor='rgba(255,215,0,0.3)';ctx.shadowBlur=5;ctx.stroke();ctx.shadowBlur=0;
        ctx.beginPath();for(let x=0;x<400;x+=5){let cx2=ox+30+x,cy=oy+160+Math.sin(x/35*Math.PI*2)*10;x===0?ctx.moveTo(cx2,cy):ctx.lineTo(cx2,cy);}ctx.strokeStyle='#ffa500';ctx.lineWidth=5;ctx.shadowColor='rgba(255,165,0,0.3)';ctx.shadowBlur=5;ctx.stroke();ctx.shadowBlur=0;
        for(let i=0;i<6;i++){let dx=ox+50+i*70,ty=oy+50+Math.sin(i*1.2)*6,by=oy+160+Math.sin(i*2.4)*8;ctx.beginPath();ctx.moveTo(dx,ty);ctx.lineTo(dx,by);ctx.strokeStyle='rgba(255,215,0,0.7)';ctx.lineWidth=2.5;ctx.stroke();ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(dx,(ty+by)/2,4,0,Math.PI*2);ctx.fill();}
        for(let i=0;i<6;i++){let dx=ox+50+i*70;ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(dx,oy+160+Math.sin(i*2.4)*8,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.strokeStyle='#4fc3f7';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(ox+130,oy+165);ctx.lineTo(ox+165,oy+135);ctx.lineTo(ox+280,oy+135);ctx.lineTo(ox+315,oy+165);ctx.stroke();ctx.fillStyle='#4fc3f7';ctx.shadowColor='rgba(79,195,247,0.3)';ctx.shadowBlur=5;ctx.fillRect(ox+160,oy+130,125,7);ctx.shadowBlur=0;
        function dl(t,tx,ty,lx,ly,co){ctx.strokeStyle=co||'#4fc3f7';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(lx,ly);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=co||'#4fc3f7';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(t,lx,ly-6);}
        dl('承力索',ox+240,oy+45,ox+240,oy+20,'#ffd700');dl('接触线',ox+240,oy+165,ox+240,oy+195,'#ffa500');dl('吊弦',ox+120,oy+105,ox+120,oy+195,'rgba(255,215,0,0.8)');dl('支柱',ox+87,oy+140,ox+87,oy+260,'#6a8aaa');dl('绝缘子',ox+87,oy+10,ox+87,oy-15,'#8a9aaa');dl('腕臂',ox+145,oy+45,ox+145,oy+195,'#6a8aaa');dl('受电弓',ox+220,oy+133,ox+350,oy+133,'#4fc3f7');dl('悬挂点',ox+50,oy+165,ox+30,oy+195,'#ffd700');
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('线路: '+d.name+' | 接触网类型: '+d.catenary+' | 结构高度: '+d.structH+' | 跨距: '+d.span,40,c.height-30);
        ctx.fillStyle='rgba(79,195,247,0.6)';ctx.textAlign='right';ctx.fillText('放大倍率: 2.0×',c.width-40,c.height-30);
    }

    function drawDetailCross(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 横截面放大',c.width);zmb(ctx,c.width,c.height,'🔍 放大区域 (2×)');
        const cx=c.width/2,cy=c.height/2+10;
        ctx.fillStyle='#1a2d3d';ctx.fillRect(0,cy+80,c.width,100);ctx.fillStyle='#0f1923';ctx.fillRect(0,cy+80,c.width,3);
        ctx.fillStyle='#2a3d4d';ctx.beginPath();ctx.moveTo(cx-180,cy+80);ctx.lineTo(cx-160,cy+55);ctx.lineTo(cx+160,cy+55);ctx.lineTo(cx+180,cy+80);ctx.fill();
        for(let i=-4;i<=4;i++){ctx.fillStyle='#3a4d5d';ctx.fillRect(cx+i*30-5,cy+45,10,35);}
        ctx.fillStyle='#7a8a9a';ctx.shadowColor='rgba(122,138,154,0.3)';ctx.shadowBlur=5;ctx.fillRect(cx-90,cy+25,15,30);ctx.fillRect(cx-93,cy+25,21,6);ctx.fillRect(cx+75,cy+25,15,30);ctx.fillRect(cx+72,cy+25,21,6);ctx.shadowBlur=0;
        ctx.fillStyle='#4fc3f7';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('← '+d.gauge+' →',cx,cy+18);
        ctx.fillStyle='#5a7a9a';ctx.shadowColor='rgba(26,115,232,0.3)';ctx.shadowBlur=5;ctx.fillRect(cx-140,cy-140,10,220);ctx.fillRect(cx+130,cy-140,10,220);ctx.shadowBlur=0;ctx.fillStyle='#6a8aaa';ctx.fillRect(cx-150,cy-145,300,7);
        ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(cx-135,cy-145,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+135,cy-145,8,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.5)';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(cx,cy-115,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=1.5;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,cy-115);ctx.lineTo(cx,cy-25);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#ffa500';ctx.shadowColor='rgba(255,165,0,0.3)';ctx.shadowBlur=5;ctx.fillRect(cx-70,cy-28,140,5);ctx.shadowBlur=0;
        ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx-60,cy-25);ctx.lineTo(cx-35,cy-45);ctx.lineTo(cx+35,cy-45);ctx.lineTo(cx+60,cy-25);ctx.stroke();ctx.fillStyle='#4fc3f7';ctx.fillRect(cx-40,cy-50,80,5);
        ctx.fillStyle='#4fc3f7';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('接触线',cx,cy-45);ctx.fillText('承力索',cx,cy-125);ctx.fillText('受电弓',cx+95,cy-40);ctx.fillText('钢轨',cx-95,cy+70);ctx.fillText('轨枕',cx,cy+70);
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('接触网高度: '+d.catenaryH,40,c.height-30);ctx.fillText('结构高度: '+d.structH,300,c.height-30);
        ctx.fillStyle='rgba(79,195,247,0.6)';ctx.textAlign='right';ctx.fillText('放大倍率: 2.0×',c.width-40,c.height-30);
    }

    function drawDetailIce(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 覆冰区段放大',c.width);zmb(ctx,c.width,c.height,'🔍 放大区域 (1.5×)');
        const sx=60,ex=c.width-60,ly=220;
        ctx.fillStyle='rgba(26,115,232,0.05)';ctx.fillRect(sx-10,ly-40,ex-sx+20,80);
        ctx.beginPath();ctx.moveTo(sx,ly);for(let x=sx;x<=ex;x+=2){let y=ly+Math.sin((x-sx)/150*Math.PI*2)*20;ctx.lineTo(x,y);}ctx.strokeStyle='#4a90d9';ctx.lineWidth=5;ctx.stroke();
        const iceSegments=[];let segCount=d.difficulty.length>=4?4:3;
        for(let i=0;i<segCount;i++){iceSegments.push({start:sx+(ex-sx)*(0.1+Math.random()*0.6),end:sx+(ex-sx)*(0.1+Math.random()*0.6)+(ex-sx)*(0.08+Math.random()*0.15),level:Math.floor(Math.random()*3)+1});}
        iceSegments.forEach(seg=>{const cs=['rgba(144,202,249,0.4)','rgba(255,183,77,0.5)','rgba(239,83,80,0.6)'],bs=['#90caf9','#ffb74d','#ef5350'];
        ctx.fillStyle=cs[seg.level-1];ctx.beginPath();ctx.moveTo(seg.start,ly-35);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/150*Math.PI*2)*20;ctx.lineTo(x,y-35);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/150*Math.PI*2)*20;ctx.lineTo(x,y+35);}ctx.closePath();ctx.fill();
        ctx.strokeStyle=bs[seg.level-1];ctx.lineWidth=2.5;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(seg.start,ly-35);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/150*Math.PI*2)*20;ctx.lineTo(x,y-35);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/150*Math.PI*2)*20;ctx.lineTo(x,y+35);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);
        let mx=(seg.start+seg.end)/2,my=ly+Math.sin((mx-sx)/150*Math.PI*2)*20;ctx.fillStyle=bs[seg.level-1];ctx.font='bold 13px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(seg.level+'级覆冰',mx,my-50);});
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('线路: '+d.name+' | 除冰难度: '+d.difficulty+' | 接触网类型: '+d.catenary,40,c.height-30);
        ctx.fillStyle='rgba(79,195,247,0.6)';ctx.textAlign='right';ctx.fillText('放大倍率: 1.5×',c.width-40,c.height-30);
    }

    // ===== 参数标注视图 =====
    function drawParamOverview(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 线路参数标注',c.width);
        const ty=280,sx=60,ex=c.width-60;
        for(let x=sx;x<ex;x+=25){ctx.fillStyle='rgba(45,74,98,0.25)';ctx.fillRect(x,ty-6,16,12);}
        ctx.shadowColor='rgba(74,144,217,0.2)';ctx.shadowBlur=5;
        ctx.beginPath();ctx.moveTo(sx,ty-10);ctx.lineTo(ex,ty-10);ctx.strokeStyle='#4a90d9';ctx.lineWidth=2.5;ctx.stroke();
        ctx.beginPath();ctx.moveTo(sx,ty+10);ctx.lineTo(ex,ty+10);ctx.strokeStyle='#4a90d9';ctx.lineWidth=2.5;ctx.stroke();ctx.shadowBlur=0;
        const pc=7,ps=(ex-sx)/(pc-1);
        for(let i=0;i<pc;i++){let px=sx+i*ps;ctx.fillStyle='#4a6a8a';ctx.fillRect(px-2.5,ty-100,5,100);ctx.fillStyle='#5a7a9a';ctx.fillRect(px-20,ty-105,40,4);ctx.fillStyle='#7a9aaa';ctx.beginPath();ctx.arc(px,ty-105,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffd700';ctx.shadowColor='rgba(255,215,0,0.4)';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(px,ty-10,3.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        ctx.beginPath();ctx.moveTo(sx,ty-65);ctx.lineTo(ex,ty-65);ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;ctx.stroke();
        ctx.beginPath();for(let i=0;i<pc-1;i++){let x1=sx+i*ps,x2=sx+(i+1)*ps,mx=(x1+x2)/2,yo=(i%2===0)?-4:4;ctx.moveTo(x1,ty-10);ctx.lineTo(mx,ty-10+yo);ctx.lineTo(x2,ty-10);}ctx.strokeStyle='#ffa500';ctx.lineWidth=2;ctx.stroke();
        d.stations.forEach((s,i)=>{let sx2=sx+(ex-sx)*(i+1)/(d.stations.length+1);ctx.fillStyle='#1a3a5a';ctx.fillRect(sx2-12,ty+20,24,16);ctx.fillStyle='#2a5a8a';ctx.beginPath();ctx.moveTo(sx2-15,ty+20);ctx.lineTo(sx2,ty+12);ctx.lineTo(sx2+15,ty+20);ctx.fill();ctx.fillStyle='#e8eaed';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(s,sx2,ty+52);ctx.fillStyle='#34a853';ctx.shadowColor='rgba(52,168,83,0.4)';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(sx2,ty,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;});
        // 参数标注
        ctx.fillStyle='#ffd700';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('← 承力索 →',c.width/2,ty-75);
        ctx.fillStyle='#ffa500';ctx.fillText('← 接触线 (Z字形) →',c.width/2,ty-25);
        ctx.fillStyle='#4a90d9';ctx.fillText('← 钢轨 →',c.width/2,ty+25);
        ctx.fillStyle='#34a853';ctx.fillText('← 车站 →',c.width/2,ty+75);
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('线路等级: '+d.level,40,c.height-60);ctx.fillText('设计时速: '+d.speed,40,c.height-40);ctx.fillText('钢轨型号: '+d.rail,350,c.height-60);ctx.fillText('轨道类型: '+d.track,350,c.height-40);
        ctx.fillStyle='#fbbc04';ctx.textAlign='right';ctx.fillText('除冰难度: '+d.difficulty,c.width-40,c.height-40);
    }

    function drawParamCatenary(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 接触网参数标注',c.width);
        const bx=80,by=150,sw=200;
        for(let s=0;s<2;s++){let sx=bx+s*sw;ctx.fillStyle='#5a7a9a';ctx.fillRect(sx-4,by-120,8,160);ctx.fillStyle='#6a8aaa';ctx.fillRect(sx-25,by-125,50,5);ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(sx,by-125,6,0,Math.PI*2);ctx.fill();}
        ctx.beginPath();ctx.moveTo(bx,by-85);ctx.quadraticCurveTo(bx+sw/2,by-95,bx+sw,by-85);ctx.strokeStyle='#ffd700';ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();ctx.moveTo(bx,by-10);ctx.quadraticCurveTo(bx+sw/2,by-5,bx+sw,by-10);ctx.strokeStyle='#ffa500';ctx.lineWidth=2.5;ctx.stroke();
        for(let s=0;s<2;s++){let sx=bx+s*sw;ctx.beginPath();ctx.moveTo(sx,by-85);ctx.lineTo(sx,by-10);ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=1;ctx.stroke();}
        // 参数标注
        function pa(t,x,y,c){ctx.fillStyle=c;ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(t,x,y);}
        pa('承力索张力: '+d.tension,bx+sw/2,by-110,'#ffd700');pa('接触线张力: '+d.contactT,bx+sw/2,by+20,'#ffa500');
        ctx.strokeStyle='#4fc3f7';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(bx+sw+40,by-85);ctx.lineTo(bx+sw+40,by-10);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#4fc3f7';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('结构高度: '+d.structH,bx+sw+48,by-50);
        ctx.strokeStyle='#34a853';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(bx+sw+100,by-10);ctx.lineTo(bx+sw+100,by+40);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#34a853';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('接触网高度: '+d.catenaryH,bx+sw+108,by+18);
        ctx.fillStyle='#5f6368';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('← 跨距 '+d.span+' →',bx+sw/2,by+60);
        ctx.fillStyle='#9aa0a6';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.fillText('轨距: '+d.gauge,bx+sw/2,by+80);
        ctx.fillStyle='#e8eaed';ctx.font='12px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('线路等级: '+d.level,40,c.height-60);ctx.fillText('设计时速: '+d.speed,40,c.height-40);ctx.fillText('钢轨型号: '+d.rail,350,c.height-60);ctx.fillText('轨道类型: '+d.track,350,c.height-40);
        ctx.fillStyle='#fbbc04';ctx.textAlign='right';ctx.fillText('除冰难度: '+d.difficulty,c.width-40,c.height-40);
        ctx.fillStyle='#5f6368';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('图例: 承力索(金) | 接触线(橙) | 支柱(灰) | 标注(蓝)',40,c.height-15);
    }

    function drawParamCross(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 横截面参数标注',c.width);
        const cx=c.width/2,cy=c.height/2+20;
        ctx.fillStyle='#1a2d3d';ctx.fillRect(0,cy+60,c.width,120);ctx.fillStyle='#0f1923';ctx.fillRect(0,cy+60,c.width,3);
        ctx.fillStyle='#2a3d4d';ctx.beginPath();ctx.moveTo(cx-160,cy+60);ctx.lineTo(cx-140,cy+40);ctx.lineTo(cx+140,cy+40);ctx.lineTo(cx+160,cy+60);ctx.fill();
        for(let i=-3;i<=3;i++){ctx.fillStyle='#3a4d5d';ctx.fillRect(cx+i*35-4,cy+30,8,30);}
        ctx.fillStyle='#7a8a9a';ctx.shadowColor='rgba(122,138,154,0.3)';ctx.shadowBlur=4;ctx.fillRect(cx-80,cy+15,12,25);ctx.fillRect(cx-82,cy+15,16,5);ctx.fillRect(cx+68,cy+15,12,25);ctx.fillRect(cx+66,cy+15,16,5);ctx.shadowBlur=0;
        ctx.fillStyle='#4fc3f7';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('← '+d.gauge+' →',cx,cy+10);
        ctx.fillStyle='#5a7a9a';ctx.fillRect(cx-120,cy-120,8,180);ctx.fillRect(cx+112,cy-120,8,180);ctx.fillStyle='#6a8aaa';ctx.fillRect(cx-130,cy-125,260,6);
        ctx.fillStyle='#8a9aaa';ctx.beginPath();ctx.arc(cx-116,cy-125,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+116,cy-125,6,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(cx,cy-100,3,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,cy-100);ctx.lineTo(cx,cy-20);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#ffa500';ctx.fillRect(cx-60,cy-22,120,4);
        ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-50,cy-20);ctx.lineTo(cx-30,cy-35);ctx.lineTo(cx+30,cy-35);ctx.lineTo(cx+50,cy-20);ctx.stroke();ctx.fillStyle='#4fc3f7';ctx.fillRect(cx-35,cy-38,70,4);
        // 参数标注
        ctx.fillStyle='#ffd700';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText('承力索',cx,cy-110);
        ctx.fillStyle='#ffa500';ctx.fillText('接触线',cx,cy-35);
        ctx.fillStyle='#4fc3f7';ctx.fillText('受电弓',cx+80,cy-30);
        ctx.fillStyle='#7a8a9a';ctx.fillText('钢轨',cx-80,cy+55);
        ctx.fillStyle='#3a4d5d';ctx.fillText('轨枕',cx,cy+55);
        ctx.fillStyle='#5f6368';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('接触网高度: '+d.catenaryH,30,420);ctx.fillText('结构高度: '+d.structH,30,440);ctx.fillText('钢轨型号: '+d.rail,30,460);ctx.fillText('轨道类型: '+d.track,350,420);ctx.fillText('轨距: '+d.gauge,350,440);
    }

    function drawParamIce(rk) {
        const c=document.getElementById('railwayCanvas'),ctx=c.getContext('2d'),d=routeData[rk];
        ctx.clearRect(0,0,c.width,c.height);bg(ctx,c.width,c.height);ttl(ctx,d.name+' · 覆冰参数标注',c.width);
        const sx=80,ex=c.width-80,ly=200;
        ctx.fillStyle='rgba(26,115,232,0.05)';ctx.fillRect(sx-10,ly-30,ex-sx+20,60);
        ctx.beginPath();ctx.moveTo(sx,ly);for(let x=sx;x<=ex;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y);}ctx.strokeStyle='#4a90d9';ctx.lineWidth=4;ctx.stroke();
        const iceSegments=[];let segCount=d.difficulty.length>=4?4:3;
        for(let i=0;i<segCount;i++){iceSegments.push({start:sx+(ex-sx)*(0.1+Math.random()*0.6),end:sx+(ex-sx)*(0.1+Math.random()*0.6)+(ex-sx)*(0.08+Math.random()*0.15),level:Math.floor(Math.random()*3)+1});}
        iceSegments.forEach(seg=>{const cs=['rgba(144,202,249,0.3)','rgba(255,183,77,0.4)','rgba(239,83,80,0.5)'],bs=['#90caf9','#ffb74d','#ef5350'];
        ctx.fillStyle=cs[seg.level-1];ctx.beginPath();ctx.moveTo(seg.start,ly-25);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y-25);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y+25);}ctx.closePath();ctx.fill();
        ctx.strokeStyle=bs[seg.level-1];ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(seg.start,ly-25);for(let x=seg.start;x<=seg.end;x+=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y-25);}for(let x=seg.end;x>=seg.start;x-=2){let y=ly+Math.sin((x-sx)/200*Math.PI*2)*15;ctx.lineTo(x,y+25);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);
        let mx=(seg.start+seg.end)/2,my=ly+Math.sin((mx-sx)/200*Math.PI*2)*15;ctx.fillStyle=bs[seg.level-1];ctx.font='bold 11px "Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.fillText(seg.level+'级覆冰',mx,my-35);});
        ctx.fillStyle='#5f6368';ctx.font='11px "Microsoft YaHei",sans-serif';ctx.textAlign='left';ctx.fillText('除冰难度: '+d.difficulty,30,460);ctx.fillText('线路全长: '+d.badge,350,460);ctx.fillText('接触网类型: '+d.catenary,30,480);ctx.fillText('设计时速: '+d.speed,350,480);
        ctx.fillStyle='#9aa0a6';ctx.font='10px "Microsoft YaHei",sans-serif';ctx.fillText('图例: 1级覆冰(蓝) | 2级覆冰(橙) | 3级覆冰(红)',30,500);
    }

    // ===== 主绘制函数 =====
    function drawDiagram(routeKey, diagramType) {
        if (currentThumb === 'main') {
            switch(diagramType) {
                case 'overview': drawOverview(routeKey); break;
                case 'catenary': drawCatenary(routeKey); break;
                case 'cross': drawCrossSection(routeKey); break;
                case 'ice': drawIceSection(routeKey); break;
            }
        } else if (currentThumb === 'detail') {
            switch(diagramType) {
                case 'overview': drawDetailOverview(routeKey); break;
                case 'catenary': drawDetailCatenary(routeKey); break;
                case 'cross': drawDetailCross(routeKey); break;
                case 'ice': drawDetailIce(routeKey); break;
            }
        } else if (currentThumb === 'param') {
            switch(diagramType) {
                case 'overview': drawParamOverview(routeKey); break;
                case 'catenary': drawParamCatenary(routeKey); break;
                case 'cross': drawParamCross(routeKey); break;
                case 'ice': drawParamIce(routeKey); break;
            }
        }
        updateInfoPanel(routeKey);
    }

    function updateInfoPanel(routeKey) {
        const d = routeData[routeKey];
        document.getElementById('routeName').textContent = d.name;
        document.getElementById('routeBadge').textContent = d.badge;
        document.getElementById('routeLevel').textContent = d.level;
        document.getElementById('maxSpeed').textContent = d.speed;
        document.getElementById('catenaryType').textContent = d.catenary;
        document.getElementById('catenaryHeight').textContent = d.catenaryH;
        document.getElementById('structHeight').textContent = d.structH;
        document.getElementById('spanLength').textContent = d.span;
        document.getElementById('trackType').textContent = d.track;
        document.getElementById('railModel').textContent = d.rail;
        document.getElementById('trackGauge').textContent = d.gauge;
        document.getElementById('tension').textContent = d.tension;
        document.getElementById('contactTension').textContent = d.contactT;
        document.getElementById('iceDifficulty').textContent = d.difficulty;
        document.getElementById('routeDesc').textContent = d.desc;
    }

    // 线路切换
    const routeBtns = document.querySelectorAll('.route-btn');
    routeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            routeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRoute = this.dataset.route;
            drawDiagram(currentRoute, currentDiagram);
        });
    });

    // 示意图类型切换
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDiagram = this.dataset.diagram;
            drawDiagram(currentRoute, currentDiagram);
        });
    });

    // 缩略图切换
    const thumbItems = document.querySelectorAll('.thumb-item');
    thumbItems.forEach(item => {
        item.addEventListener('click', function() {
            thumbItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentThumb = this.dataset.thumb;
            drawDiagram(currentRoute, currentDiagram);
        });
    });

    // 默认绘制
    drawDiagram('haqi', 'overview');

    // ============================================
    // 页面2: 刀头配重计算
    // ============================================
    const weightData = {
        1:{weight:180,model:'DT-180',range:'1-2 mm',freq:'25-30 Hz',power:'1.2 kW'},
        2:{weight:260,model:'DT-260',range:'1-3 mm',freq:'22-28 Hz',power:'1.5 kW'},
        3:{weight:350,model:'DT-350',range:'2-4 mm',freq:'20-25 Hz',power:'1.8 kW'},
        4:{weight:420,model:'DT-420',range:'3-5 mm',freq:'18-22 Hz',power:'2.2 kW'},
        5:{weight:470,model:'DT-470',range:'3-7 mm',freq:'15-20 Hz',power:'2.5 kW'},
        6:{weight:520,model:'DT-520',range:'4-8 mm',freq:'15-18 Hz',power:'2.8 kW'},
        7:{weight:580,model:'DT-580',range:'5-9 mm',freq:'12-16 Hz',power:'3.0 kW'},
        8:{weight:630,model:'DT-630',range:'6-10 mm',freq:'12-15 Hz',power:'3.2 kW'},
        9:{weight:680,model:'DT-680',range:'7-11 mm',freq:'10-14 Hz',power:'3.5 kW'},
        10:{weight:720,model:'DT-720',range:'8-12 mm',freq:'10-13 Hz',power:'3.8 kW'},
        11:{weight:760,model:'DT-760',range:'9-13 mm',freq:'9-12 Hz',power:'4.0 kW'},
        12:{weight:800,model:'DT-800',range:'10-15 mm',freq:'8-12 Hz',power:'4.2 kW'},
        13:{weight:850,model:'DT-850',range:'11-16 mm',freq:'8-11 Hz',power:'4.5 kW'},
        14:{weight:900,model:'DT-900',range:'12-18 mm',freq:'7-10 Hz',power:'4.8 kW'},
        15:{weight:950,model:'DT-950',range:'13-20 mm',freq:'7-9 Hz',power:'5.0 kW'},
        16:{weight:1000,model:'DT-1000',range:'14-22 mm',freq:'6-9 Hz',power:'5.2 kW'},
        17:{weight:1060,model:'DT-1060',range:'15-24 mm',freq:'6-8 Hz',power:'5.5 kW'},
        18:{weight:1120,model:'DT-1120',range:'16-26 mm',freq:'5-8 Hz',power:'5.8 kW'},
        19:{weight:1180,model:'DT-1180',range:'17-28 mm',freq:'5-7 Hz',power:'6.0 kW'},
        20:{weight:1240,model:'DT-1240',range:'18-30 mm',freq:'4-7 Hz',power:'6.2 kW'},
        21:{weight:1300,model:'DT-1300',range:'19-30 mm',freq:'4-6 Hz',power:'6.5 kW'},
        22:{weight:1360,model:'DT-1360',range:'20-30 mm',freq:'3-6 Hz',power:'6.8 kW'},
        23:{weight:1420,model:'DT-1420',range:'21-30 mm',freq:'3-5 Hz',power:'7.0 kW'},
        24:{weight:1480,model:'DT-1480',range:'22-30 mm',freq:'3-5 Hz',power:'7.2 kW'},
        25:{weight:1520,model:'DT-1520',range:'23-30 mm',freq:'2-4 Hz',power:'7.5 kW'}
    };

    const iceTypeFactors = { rime: 0.7, glaze: 1.0, mixed: 1.3, hard: 1.6 };

    function calculateWeight() {
        const thickness = parseInt(document.getElementById('iceThickness').value) || 5;
        const iceType = document.getElementById('iceType').value;
        const factor = iceTypeFactors[iceType] || 1.0;
        const adjustedThickness = Math.min(30, Math.max(1, Math.round(thickness * factor)));
        const index = Math.min(25, Math.max(1, Math.round(adjustedThickness * 25 / 30)));
        const data = weightData[index];
        document.getElementById('weightResult').textContent = data.weight;
        document.getElementById('bladeModel').textContent = data.model;
        document.getElementById('iceRange').textContent = data.range;
        document.getElementById('impactFreq').textContent = data.freq;
        document.getElementById('powerSuggest').textContent = data.power;
        drawWeightChart(thickness, factor);
    }

    function drawWeightChart(thickness, factor) {
        const c = document.getElementById('weightChart'), ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        ctx.clearRect(0, 0, w, h);
        const pad = { top: 20, right: 20, bottom: 30, left: 40 };
        const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
        ctx.fillStyle = '#0f1923'; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#2d4a62'; ctx.lineWidth = 0.5;
        for (let i = 0; i <= 5; i++) {
            let y = pad.top + ch - (ch / 5) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
            ctx.fillStyle = '#5f6368'; ctx.font = '9px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText((i * 300) + 'g', pad.left - 5, y + 3);
        }
        ctx.fillStyle = '#5f6368'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        for (let i = 0; i <= 5; i++) {
            let x = pad.left + (cw / 5) * i;
            ctx.fillText((i * 5 + 5) + 'mm', x, h - 8);
        }
        ctx.strokeStyle = '#1a73e8'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 1; i <= 30; i++) {
            let idx = Math.min(25, Math.max(1, Math.round(i * factor * 25 / 30)));
            let wgt = weightData[idx].weight;
            let x = pad.left + (cw / 30) * (i - 1);
            let y = pad.top + ch - (wgt / 1500) * ch;
            i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#4fc3f7'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('冰厚-配重关系曲线', pad.left, 14);
        let idx2 = Math.min(25, Math.max(1, Math.round(thickness * factor * 25 / 30)));
        let curWgt = weightData[idx2].weight;
        let cx = pad.left + (cw / 30) * (thickness - 1);
        let cy = pad.top + ch - (curWgt / 1500) * ch;
        ctx.fillStyle = '#ef5350'; ctx.shadowColor = 'rgba(239,83,80,0.5)'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ef5350'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(curWgt + 'g', cx, cy - 10);
    }

    // 配重计算事件
    document.getElementById('calcWeightBtn').addEventListener('click', calculateWeight);
    document.getElementById('thicknessSlider').addEventListener('input', function() {
        document.getElementById('iceThickness').value = this.value;
        calculateWeight();
    });
    document.getElementById('iceThickness').addEventListener('change', function() {
        let v = parseInt(this.value) || 1;
        v = Math.min(30, Math.max(1, v));
        this.value = v;
        document.getElementById('thicknessSlider').value = v;
        calculateWeight();
    });
    document.getElementById('iceType').addEventListener('change', calculateWeight);

    // 初始计算
    calculateWeight();

    // ============================================
    // 页面3: 轨道参考速度
    // ============================================
    const weatherFactors = { clear: 1.0, cloudy: 0.85, snowy: 0.65, storm: 0.4 };
    const lineSpeedLimits = { high: 80, medium: 60, low: 40 };

    function calculateSpeed() {
        const thickness = parseInt(document.getElementById('speedIceThickness').value) || 5;
        const weather = document.getElementById('weatherCondition').value;
        const lineType = document.getElementById('lineType').value;
        const wf = weatherFactors[weather] || 1.0;
        const maxSpeed = lineSpeedLimits[lineType] || 60;
        const baseSpeed = Math.max(10, 80 - thickness * 2);
        const speed = Math.round(Math.min(maxSpeed, baseSpeed * wf));
        const maxSafe = Math.round(Math.min(maxSpeed, speed * 1.3));
        const minWork = Math.round(speed * 0.4);
        const efficiency = Math.round(Math.max(40, 100 - thickness * 2));
        const estTime = Math.round(60 / speed * 10) / 10;
        let risk = '低';
        if (thickness > 15) risk = '高';
        else if (thickness > 8) risk = '中';
        document.getElementById('speedResult').textContent = speed;
        document.getElementById('recSpeed').textContent = speed + ' km/h';
        document.getElementById('maxSafeSpeed').textContent = maxSafe + ' km/h';
        document.getElementById('minWorkSpeed').textContent = minWork + ' km/h';
        document.getElementById('iceEfficiency').textContent = efficiency + '%';
        document.getElementById('estTime').textContent = estTime + ' min/km';
        document.getElementById('riskLevel').textContent = risk;
        drawSpeedGauge(speed, maxSpeed);
        updateSpeedTable(thickness, weather, lineType);
    }

    function drawSpeedGauge(speed, maxSpeed) {
        const c = document.getElementById('speedGauge'), ctx = c.getContext('2d');
        const w = c.width, h = c.height, cx = w / 2, cy = h / 2 + 20, r = Math.min(w, h) / 2 - 30;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f1923'; ctx.fillRect(0, 0, w, h);
        const startAngle = Math.PI * 0.75, endAngle = Math.PI * 2.25;
        const range = endAngle - startAngle;
        const speedAngle = startAngle + (speed / maxSpeed) * range;
        ctx.lineWidth = 18;
        for (let i = 0; i < 100; i++) {
            let a = startAngle + (range / 100) * i;
            let p = i / 100;
            let color;
            if (p < 0.5) color = `rgba(52,168,83,${0.3 + p * 0.7})`;
            else if (p < 0.75) color = `rgba(251,188,4,${0.3 + (p - 0.5) * 1.4})`;
            else color = `rgba(234,67,53,${0.3 + (p - 0.75) * 1.6})`;
            ctx.strokeStyle = color;
            ctx.beginPath(); ctx.arc(cx, cy, r, a, a + range / 100); ctx.stroke();
        }
        ctx.strokeStyle = '#e8eaed'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r - 2, startAngle, speedAngle); ctx.stroke();
        ctx.fillStyle = '#e8eaed'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('0', cx - r + 20, cy + 5);
        ctx.fillText(maxSpeed + ' km/h', cx + r - 30, cy + 5);
        const needleLen = r - 25;
        let nx = cx + Math.cos(speedAngle) * needleLen;
        let ny = cy + Math.sin(speedAngle) * needleLen;
        ctx.strokeStyle = '#ef5350'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(239,83,80,0.5)'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ef5350'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f1923'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    }

    function updateSpeedTable(thickness, weather, lineType) {
        const tbody = document.getElementById('speedTableBody');
        tbody.innerHTML = '';
        const wf = weatherFactors[weather] || 1.0;
        const maxSpeed = lineSpeedLimits[lineType] || 60;
        for (let t = 1; t <= 30; t += 2) {
            const base = Math.max(10, 80 - t * 2);
            const speed = Math.round(Math.min(maxSpeed, base * wf));
            const maxSafe = Math.round(Math.min(maxSpeed, speed * 1.3));
            const eff = Math.round(Math.max(40, 100 - t * 2));
            let risk = '低';
            if (t > 15) risk = '高';
            else if (t > 8) risk = '中';
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${t} mm</td><td>${speed} km/h</td><td>${maxSafe} km/h</td><td>${eff}%</td><td>${risk}</td>`;
            if (t === thickness) tr.style.background = 'rgba(26,115,232,0.2)';
            tbody.appendChild(tr);
        }
    }

    // 速度计算事件
    document.getElementById('speedThicknessSlider').addEventListener('input', function() {
        document.getElementById('speedIceThickness').value = this.value;
        calculateSpeed();
    });
    document.getElementById('speedIceThickness').addEventListener('change', function() {
        let v = parseInt(this.value) || 1;
        v = Math.min(30, Math.max(1, v));
        this.value = v;
        document.getElementById('speedThicknessSlider').value = v;
        calculateSpeed();
    });
    document.getElementById('weatherCondition').addEventListener('change', calculateSpeed);
    document.getElementById('lineType').addEventListener('change', calculateSpeed);

    // 初始计算
    calculateSpeed();

    // ===== Canvas 自适应缩放 =====
    function resizeCanvas() {
        const canvas = document.getElementById('railwayCanvas');
        const wrapper = document.getElementById('diagramWrapper');
        if (canvas && wrapper) {
            const wrapperWidth = wrapper.clientWidth;
            if (wrapperWidth > 0) {
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
            }
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});
