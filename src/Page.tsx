import { useCallback, useEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from 'react';
import { motion, type Variants } from 'framer-motion';

import styles from './Page.module.css';

const iconFiles = [
  'ai.svg',
  'ps.svg',
  'id.svg',
  'ae.svg',
  'figma.svg',
  'gpt.svg',
  'gemini.svg',
  'coler.svg',
  'tilda.svg',
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

const linkIcons = [
  'telegram.svg',
  'dpofile.svg',
  'behance.svg',
  'pinterest.svg',
  'dysigners.svg',
];

const maskIcons = [
  '123.svg',
  '1234.svg'
];

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
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      setIsSmallScreen(width <= 720);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Loading state
  const [areExternalResourcesLoaded, setAreExternalResourcesLoaded] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);
  
  // Total images to wait for via onLoad: Alice photo + 9 icons = 10.
  const totalMainImages = 1 + iconFiles.length; 

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Preload SVGs (links + masks)
        const allSvgs = [...linkIcons.map(i => `/images/icons/${i}`), ...maskIcons.map(i => `/images/${i}`)];
        const svgPromises = allSvgs.map(src => new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // proceed anyway
        }));

        // Wait for fonts
        const fontPromise = document.fonts.ready;

        await Promise.all([...svgPromises, fontPromise]);
      } catch (e) {
        console.error("Resource loading error", e);
      } finally {
        setAreExternalResourcesLoaded(true);
      }
    };
    
    loadResources();
  }, []);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    setLoadedImageCount(prev => prev + 1);
  };

  const isPageReady = areExternalResourcesLoaded && loadedImageCount >= totalMainImages;

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
    maxScale: 1.2,
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
    if (isSwapping) {
      return magnification.baseScale;
    }

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
      y: [null, isMobile ? -400 : -450, 0],
      scale: [null, 1.05, 1],
      rotate: [null, -8, 0],
      transition: { 
        duration: 0.8, 
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    },
    idle: {
      y: 0,
      rotate: 0,
      scale: 1
    },
    inactive: {
      y: -2,
      rotate: 0,
      scale: 0.995,
      transition: { 
        duration: 0.8, 
        ease: "easeInOut"
      }
    },
    inactiveSwap: {
      y: [null, isMobile ? 220 : 280, -2],
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
    <div 
      className={styles.page} 
      style={{ 
        opacity: isPageReady ? 1 : 0, 
        transition: 'opacity 0.5s ease' 
      }}
    >
      <div className={styles.shape}></div>

      <div className={styles.firstCard} style={{ position: 'relative', height: isMobile ? 500 : 550 }}>
        
        {/* About Card Group */}
        <motion.div
            variants={cardVariants}
            initial="idle"
            animate={
                activeTab === 'about' 
                    ? (isSwapping ? 'active' : 'idle')
                    : (isSwapping 
                        ? 'inactiveSwap' 
                        : (hoveredTab === 'about' ? 'inactiveHover' : 'inactive'))
            }
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                transformOrigin: 'bottom center',
                zIndex: getZIndex('about'),
                cursor: activeTab === 'about' ? 'auto' : 'pointer',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
            onClick={() => handleTabClick('about')}
            onMouseEnter={() => setHoveredTab('about')}
            onMouseLeave={() => setHoveredTab(null)}
        >
            <div className={styles.cardPrimary}>
                <div 
                    className={styles.tab} 
                    style={{ 
                        cursor: activeTab === 'about' ? 'default' : 'pointer' 
                    }}
                >
                    <span>about me</span>
                </div>
                
               <img
                    src="/images/other/Frame 1597878152 (1).png"
                    alt="Alice"
                    loading="eager"
                    className={styles.alicePhoto}
                    draggable={false}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                  />

                <div className={styles.cardPrimaryContent}>
                  <h1>Привет! Меня зовут Алиса, мне 22 года, я графический дизайнер.</h1>
                  <div className={styles.divider}></div>
                  <div className={styles.scrollableText}>
                    <p>Начала свой путь в дизайне с апреля 2024 года пройдя годовой курс в <a href="https://t.me/akeishapage/792" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Яндекс Практикуме</a>. За это время успела поработать над стартапом, в <a href="https://t.me/akeishapage/801" target="_blank" rel="noopener noreferrer" className={styles.textLink}>типографии</a> и с другими отдельными проектами.</p>
                    <p>Считаю, что сила в комьюнити, поэтому активно участвую в <a href="https://t.me/akeishapage/942" target="_blank" rel="noopener noreferrer" className={styles.textLink}>конкурсах</a>, общаюсь с коллегами и слежу за дизайн-сферой. Вписываюсь в <a href="https://t.me/akeishapage/998" target="_blank" rel="noopener noreferrer" className={styles.textLink}>марафоны</a>, <a href="https://t.me/akeishapage/920" target="_blank" rel="noopener noreferrer" className={styles.textLink}>челленджи</a> и <a href="https://t.me/akeishapage/867" target="_blank" rel="noopener noreferrer" className={styles.textLink}>воркшопы</a>. Мечтаю посетить все самые значимые <a href="https://t.me/akeishapage/819" target="_blank" rel="noopener noreferrer" className={styles.textLink}>ивенты</a> в нашей сфере.</p>
                    <p>По основному образованию я системный администратор с опытом веб-разработки, что даёт мне бонус, в качестве ускоренного изучения новых программ и технического взгляда на многие вещи.</p>
                  </div>
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
                      const finalScale = scale * 0.5;

                      return (
                        <div
                          key={icon.file}
                          className={styles.iconWrapper}
                          data-tooltip={icon.label}
                          aria-label={icon.label}
                          style={{ zIndex: Math.round(scale * 100) }}
                          ref={(element) => {
                            iconRefs.current[index] = element;
                          }}
                        >
                          <picture>
                            <motion.img
                              className={styles.icon}
                              src={`/images/icons/${icon.file}`}
                              alt={icon.label}
                              loading="eager"
                              draggable={false}
                              animate={{ 
                                scale: finalScale, 
                                y: -lift 
                              }}
                              transition={{ type: 'tween', duration: 0.12, ease: 'easeOut' }}
                              onLoad={handleImageLoad}
                              onError={handleImageLoad}
                            />
                          </picture>
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
                    ? (isSwapping ? 'active' : 'idle')
                    : (isSwapping 
                        ? 'inactiveSwap' 
                        : (hoveredTab === 'links' ? 'inactiveHover' : 'inactive'))
            }
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                transformOrigin: 'bottom center', 
                zIndex: getZIndex('links'),
                cursor: activeTab === 'links' ? 'auto' : 'pointer',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
            onClick={() => handleTabClick('links')}
            onMouseEnter={() => setHoveredTab('links')}
            onMouseLeave={() => setHoveredTab(null)}
        >
             <div className={styles.cardSecondary}>
                <div 
                    className={styles.tab2} 
                    style={{ 
                        cursor: activeTab === 'links' ? 'default' : 'pointer' 
                    }}
                >
                    <span>links</span>
                </div>
                <div className={styles.linksContainer}>
                   <a href="https://t.me/akeishapage" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                     <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/telegram.svg)`, maskImage: `url(/images/icons/telegram.svg)` }} />
                     <span>Основной тг-канал</span>
                   </a>
                   
                   <a href="https://t.me/akeiha_dsgnhack" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                     <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/telegram.svg)`, maskImage: `url(/images/icons/telegram.svg)` }} />
                     <span>Полезный тг-канал</span>
                   </a>

                   <div className={styles.splitButtons}>
                      <a href="https://dprofile.ru/akeiha" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                        <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/dpofile.svg)`, maskImage: `url(/images/icons/dpofile.svg)` }} />
                        <span>Dprofile</span>
                      </a>
                      <a href="https://www.behance.net/alisakurlapova" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                        <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/behance.svg)`, maskImage: `url(/images/icons/behance.svg)` }} />
                        <span>Behance</span>
                      </a>
                   </div>

                   <a href="https://ru.pinterest.com/akeishapage/" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                     <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/pinterest.svg)`, maskImage: `url(/images/icons/pinterest.svg)` }} />
                     <span>Pinterest</span>
                   </a>

                   <a href="https://dsgners.ru/Akeiha" className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                     <div className={styles.linkButtonIcon} style={{ WebkitMaskImage: `url(/images/icons/dysigners.svg)`, maskImage: `url(/images/icons/dysigners.svg)` }} />
                     <span>Дизайнерс</span>
                   </a>
                </div>
             </div>
        </motion.div>

      </div>
    </div>
  );
}
