import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, type Variants } from 'framer-motion';

import styles from './Page.module.css';

const iconFiles = [
  '48a907afa67c599b291775367e80fa0336b61061.png',
  '320cca232dd45144bb7789abca8bbb4c56ffac9b.png',
  '1c5dcb31ef04d04b6cd511adc2a4435d42c165e5.png',
  '34d406fa66a3ff76480bbf2c2003e8da22e2a704.png',
  '87b83e428c4e9efe2b1020730dd56c55cef097c9.png',
  'image 242.png',
  'gemini.png',
  '69b375c9f4ebeac5d1e986b45de38cfb2f089c09.png',
  'be0566d4c4d7618c0f3c43af8fe4a0eb73401bd6.png',
];

const iconLabels = [
  'Adobe Illustrator',
  'Adobe Photoshop',
  'Adobe InDesign',
  'After Effects',
  'Figma',
  'ChatGPT',
  'Gemini Nana Banana',
  'CorelDRAW',
  'Tilda',
];

const iconData = iconFiles.map((file, index) => ({
  file,
  label: iconLabels[index] ?? `Программа ${index + 1}`,
}));

export default function Page() {
  const iconsContainerRef = useRef<HTMLDivElement>(null);
  const containerRectRef = useRef<DOMRect | null>(null);
  const iconRefs = useRef<(HTMLElement | null)[]>([]);
  const iconCentersRef = useRef<number[]>([]);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'links'>('about');
  const [topZIndexTab, setTopZIndexTab] = useState<'about' | 'links'>('about');
  const [hoveredTab, setHoveredTab] = useState<'about' | 'links' | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleTabClick = (tab: 'about' | 'links') => {
    if (activeTab === tab) return;
    setIsSwapping(true);
    setActiveTab(tab);
    
    // Меняем z-index ровно посередине анимации (0.4s из 0.8s)
    setTimeout(() => {
      setTopZIndexTab(tab);
    }, 400);

    setTimeout(() => setIsSwapping(false), 800);
  };

  const magnification = {
    maxScale: 1.3,
    baseScale: 1,
    radius: 100,
  };

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const container = iconsContainerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    containerRectRef.current = rect;

    setPointer({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointer(null);
  }, []);

  useEffect(() => {
    const updateCenters = () => {
      iconCentersRef.current = iconRefs.current.map((icon) => {
        if (!icon) {
          return 0;
        }

        return icon.offsetLeft + icon.offsetWidth / 2;
      });
    };

    updateCenters();

    const handleResize = () => {
      updateCenters();
    };

    window.addEventListener('resize', handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && iconsContainerRef.current) {
      observer = new ResizeObserver(updateCenters);
      observer.observe(iconsContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
    };
  }, []);

  const getScaleForIcon = (index: number) => {
    if (!pointer) {
      return magnification.baseScale;
    }

    const centerX = iconCentersRef.current[index];
    if (centerX === undefined) {
      return magnification.baseScale;
    }

    const distance = Math.abs(pointer.x - centerX);

    if (distance > magnification.radius) {
      return magnification.baseScale;
    }

    const proximity = Math.max(0, 1 - distance / magnification.radius);
    const adjustedScale =
      magnification.baseScale + proximity * (magnification.maxScale - magnification.baseScale);

    return Math.min(adjustedScale, magnification.maxScale);
  };

  const getZIndex = (tab: 'about' | 'links') => {
    if (topZIndexTab === tab) return 20;
    if (hoveredTab === tab && !isSwapping) return 15;
    return 10;
  };

  const cardVariants: Variants = {
    active: {
      y: [null, -450, 0],
      scale: [null, 1.05, 1],
      rotate: [null, -8, 0],
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    },
    inactive: {
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeInOut"
      }
    },
    inactiveSwap: {
      y: [null, 280, 0],
      rotate: [null, 8, 0],
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    },
    inactiveHover: {
      y: -10,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shape}></div>

      <div className={styles.firstCard} style={{ position: 'relative', height: 550 }}>
        
        {/* About Card Group */}
        <motion.div
            variants={cardVariants}
            initial="active"
            animate={
                activeTab === 'about' 
                    ? 'active' 
                    : (hoveredTab === 'about' 
                        ? 'inactiveHover' 
                        : (isSwapping ? 'inactiveSwap' : 'inactive'))
            }
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                transformOrigin: 'bottom center',
                zIndex: getZIndex('about'),
                cursor: activeTab === 'about' ? 'auto' : 'pointer'
            }}
            onClick={() => handleTabClick('about')}
            onMouseEnter={() => setHoveredTab('about')}
            onMouseLeave={() => setHoveredTab(null)}
        >
            <div className={styles.cardPrimary}>
                <div 
                    className={styles.tab} 
                    style={{ 
                        top: -50, 
                        position: 'absolute', 
                        cursor: activeTab === 'about' ? 'default' : 'pointer' 
                    }}
                >
                    <span>about me</span>
                </div>
                <img
                  src="/images/other/Frame 1597878152 (1).png"
                  alt="Alice"
                  loading="lazy"
                  className={styles.alicePhoto}
                  draggable={false}
                />

                <div className={styles.cardPrimaryContent}>
                  <h1>Привет! Меня зовут Алиса, мне 21 год, я графический дизайнер.</h1>
                  <div className={styles.divider}></div>
                  <p>Начала свой путь в дизайне с апреля 2024 года пройдя годовой курс в Яндекс Практикуме. За это время успела поработать над стартапом, в типографии и с другими отдельными проектами.</p>
                  <p>Считаю, что сила в комьюнити, поэтому активно участвую в конкурсах, общаюсь с коллегами и слежу за дизайн-сферой. Вписываюсь в марафоны, челленджи и воркшопы. Мечтаю посетить все самые значимые ивенты в нашей сфере.</p>
                  <p>По основному образованию я системный администратор с опытом веб-разработки, что даёт мне бонус, в качестве ускоренного изучения новых программ и технического взгляда на многие вещи.</p>
                  <div className={styles.divider}></div>
                  <div
                    ref={iconsContainerRef}
                    className={styles.imagesBlock}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {iconData.map((icon, index) => {
                      const scale = getScaleForIcon(index);
                      const lift = (scale - 1) * 14;

                      return (
                        <div
                          key={icon.file}
                          className={styles.iconWrapper}
                          data-tooltip={icon.label}
                          aria-label={icon.label}
                          ref={(element) => {
                            iconRefs.current[index] = element;
                          }}
                        >
                          <motion.img
                            className={styles.icon}
                            src={`/images/icons/${icon.file}`}
                            alt={icon.label}
                            loading="lazy"
                            draggable={false}
                            animate={{ scale, y: -lift }}
                            transition={{ type: 'tween', duration: 0.12, ease: 'easeOut' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
        </motion.div>

        {/* Links Card Group */}
        <motion.div
            variants={cardVariants}
            initial="inactive"
            animate={
                activeTab === 'links' 
                    ? 'active' 
                    : (hoveredTab === 'links' 
                        ? 'inactiveHover' 
                        : (isSwapping ? 'inactiveSwap' : 'inactive'))
            }
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                transformOrigin: 'bottom center', 
                zIndex: getZIndex('links'),
                cursor: activeTab === 'links' ? 'auto' : 'pointer'
            }}
            onClick={() => handleTabClick('links')}
            onMouseEnter={() => setHoveredTab('links')}
            onMouseLeave={() => setHoveredTab(null)}
        >
             <div className={styles.cardSecondary}>
                <div 
                    className={styles.tab2} 
                    style={{ 
                        top: -50, 
                        position: 'absolute', 
                        cursor: activeTab === 'links' ? 'default' : 'pointer' 
                    }}
                >
                    <span>links</span>
                </div>
                123
             </div>
        </motion.div>

      </div>
    </div>
  );
}
