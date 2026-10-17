import {spawnSync} from 'node:child_process';
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';function run(args){const p=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});if(p.error)throw p.error;if(p.status!==0)process.exit(p.status||1);}
run(['-i','docs/demo/clonepayloads-demo.webm','-an','-c:v','libx264','-crf','23','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','docs/demo/clonepayloads-demo.mp4']);
run(['-i','docs/demo/clonepayloads-demo.webm','-t','10','-filter_complex','[0:v]fps=8,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse','-loop','0','docs/demo/preview.gif']);
