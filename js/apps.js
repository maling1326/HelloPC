let data_pc, data_comp, data_monitor, data_peripherals, category_state;

document.addEventListener('DOMContentLoaded', async () => {
    // make_loading_screen();
    // loading(true);
    // Kalau Page saat ini adalah index.html
    if (document.getElementById('cardContainer')) {
        load_header();
        load_footer();
        
        try {
            await Promise.all
            ([
                fetch_pc(),
                fetch_comp(),
                fetch_monitor(),
                fetch_peripheral()
            ]);
            console.log('Berhasil memuat semua data');
            load_pc();
        } catch (error) {
            alert('Gagal memuat salah satu data', error);
            console.log('Gagal memuat salah satu data', error);
        }
    }
    
    // Kalau Page saat ini adalah details.html
    else if (document.querySelector('[data-list]')) {
        load_header();
        load_footer();
        
        const urlParam = new URLSearchParams(window.location.search);
        const category = urlParam.get('category');
        const id       = urlParam.get('id');
        
        try {
            if (category == 'prebuilt-pc'){
                await fetch_pc();
                load_pc_detail(id);
            }
            else if (category == 'internal-part') {
                await fetch_comp();
                load_internal_comp_detail(id);
            }
            else if (category == 'monitor') {
                await fetch_monitor();
                load_monitor_detail(id);
            }
            else if (category == 'peripheral') {
                await fetch_peripheral();
                load_peripherals_detail(id);
            }
            
        } catch (error) {
            console.log("Gagal Memuat data ${category} dengan error:", error)
        }
    }
    
    // Kalau Page saat ini adalah transaction.html
    else {
        const urlParam = new URLSearchParams(window.location.search);
        const title = urlParam.get('title');
        const price = urlParam.get('price');
        
        document.querySelector('[data-title]').innerText = title;
        
    }
    // setTimeout(() => { loading(false); }, 250);
});

/** Detail.html
 *
 * Dari sini sampai ke bawah adalah
 * fungsi dari halaman detail.html
 */
const load_pc_detail = (id) => {
    const pcs = data_pc.prebuilt_pc_card.filter((pc) => {
        return pc.id.toLowerCase().includes(id);
    }); const pc_id = pcs[0];

    document.getElementById('link_transaction').setAttribute('href', `transaction.html?title=${pc_id.title}&price=${pc_id.price}`);
    document.querySelector('[data-image]').setAttribute('src', pc_id.img_dir)
    document.querySelector('[data-brief]').innerHTML = pc_id.brief_explanation;
    document.querySelector('[data-title]').innerHTML = pc_id.title;
    document.querySelector('[data-price]').innerHTML = pc_id.price;
    
    const temp = document.getElementsByTagName('template')[0];
    const list = document.querySelector('[data-list]');
    
    
    list.innerHTML = '';
    
    const specList = [
        {title: 'Processor',    key:'cpu'},
        {title: 'Motherboard',  key:'mobo'},
        {title: 'GPU',          key:'gpu'},
        {title: 'SSD',          key:'ssd'},
        {title: 'RAM',          key:'ram'},
        {title: 'PSU',          key:'fan'},
        {title: 'Casing',       key:'case'},
    ]
    
    specList.forEach( spec => {
        let clon  = temp.content.cloneNode(true);
        clon.querySelector('[data-title]').innerHTML = spec.title;
        clon.querySelector('[data-desc]').innerHTML = pc_id[spec.key];
        list.appendChild(clon);
    })
}

const load_internal_comp_detail = (id) => {
    const comps = data_comp.internal_component_card.filter((comp) => {
        return comp.id.toLowerCase().includes(id);
    }); const part_id = comps[0];
    
    document.querySelector('[data-image]').setAttribute('src', part_id.img_dir);
    document.querySelector('[data-brief]').innerHTML = part_id.brief_explanation;
    document.querySelector('[data-title]').innerHTML = part_id.title;
    document.querySelector('[data-price]').innerHTML = part_id.price;
    
    const spec = part_id.specifications;
    
    console.log(spec);
    console.log(spec.brand);
    
    const temp = document.getElementsByTagName('template')[0];
    const list = document.querySelector('[data-list]');
    
    list.innerHTML = '';
    
    for (const [key, value] of Object.entries(spec)) {   
        let clon  = temp.content.cloneNode(true);
        clon.querySelector('[data-title]').innerHTML = key;
        clon.querySelector('[data-desc]').innerHTML = (value === true) ? 'Supported' : value;
        list.appendChild(clon);
    }
}

const load_monitor_detail = (id) => {
    const monitors = data_monitor.monitor_card.filter((monitor) => {
        return monitor.id.toLowerCase().includes(id);
    }); const monitor_id = monitors[0];
    
    document.querySelector('[data-image]').setAttribute('src', monitor_id.img_dir);
    document.querySelector('[data-brief]').innerHTML = monitor_id.brief_explanation;
    document.querySelector('[data-title]').innerHTML = monitor_id.title;
    document.querySelector('[data-price]').innerHTML = monitor_id.price;
    
    const temp = document.getElementsByTagName('template')[0];
    const list = document.querySelector('[data-list]');
    
    list.innerHTML = '';
    
    const specs = monitor_id.specifications;
    const specList = [
        {title: 'Size',          key:'size'},
        {title: 'Panel Type',    key:'panel_type'},
        {title: 'Resolution',    key:'resolution'},
        {title: 'Refresh Rate',  key:'refresh_rate'},
        {title: 'Response Time', key:'response_time'},
        {title: 'Adaptive Sync', key:'adaptive_sync'},
    ]
    
    specList.forEach( spec => {
        let clon  = temp.content.cloneNode(true);
        clon.querySelector('[data-title]').innerHTML = spec.title;
        clon.querySelector('[data-desc]').innerHTML = specs[spec.key];
        list.appendChild(clon);
    })
}

const load_peripherals_detail = (id) => {
    const comps = data_peripherals.peripherals_card.filter((periph) => {
        return periph.id.toLowerCase().includes(id);
    }); const peripheral_id = comps[0];
    
    document.querySelector('[data-image]').setAttribute('src', peripheral_id.img_dir);
    document.querySelector('[data-brief]').innerHTML = peripheral_id.brief_explanation;
    document.querySelector('[data-title]').innerHTML = peripheral_id.title;
    document.querySelector('[data-price]').innerHTML = peripheral_id.price;
    
    const spec = peripheral_id.specifications;
    
    console.log(spec);
    console.log(spec.brand);
    
    const temp = document.getElementsByTagName('template')[0];
    const list = document.querySelector('[data-list]');
    
    list.innerHTML = '';
    
    for (const [key, value] of Object.entries(spec)) {   
        let clon  = temp.content.cloneNode(true);
        clon.querySelector('[data-title]').innerHTML = key;
        clon.querySelector('[data-desc]').innerHTML = (value === true) ? 'Supported' : value;
        list.appendChild(clon);
    }
}


/* Dari sini sampai ke bawah adalah 
 * Code untuk halaman index.html
 * Fetch list data prebuilt pc
 */
async function fetch_pc() {
    const response = await fetch('.\\assets\\data\\prebuilt_pc.json');
    if (!response.ok) throw new Error(`Gagal fetch Component: ${response.statusText}`);
    data_pc = await response.json();
    console.log('Data PC Berhasil di fetch', data_pc);
}

// Fetch list data internal component
async function fetch_comp() {
    const response = await fetch('.\\assets\\data\\internal_component.json')
    if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
    data_comp = await response.json();
    console.log('Data Component Berhasil di fetch', data_comp);
}
    
// Fetch list data monitor
async function fetch_monitor() {
    const response = await fetch('.\\assets\\data\\monitor.json')
    if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
    data_monitor = await response.json();
    console.log('Data Component Berhasil di fetch', data_monitor);
}
    
// Fetch list data peripherals
async function fetch_peripheral() {
    const response = await fetch('.\\assets\\data\\peripherals.json')
    if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
    data_peripherals = await response.json();
    console.log('Data Component Berhasil di fetch', data_peripherals);
}
    
const load_pc = () => {
    category_state = 0;
    console.log("Loading Prebuilt PC");
    let card_template  = document.getElementsByTagName('template')[0];
    let card_container = document.getElementById('cardContainer');
    document.getElementById('category_selected').innerText = 'Prebuilt PC';
    
    card_container.innerHTML = '';
    let i = 0, limit = 8;
    
    data_pc.prebuilt_pc_card.forEach(pc => {
        let clon = card_template.content.cloneNode(true);
        
        const detailLink = `detail.html?category=prebuilt-pc&id=${pc.id}`;
        clon.querySelector('[data-id]').setAttribute('href', detailLink);
        
        clon.querySelector('[data-image]').src       = pc.img_dir;
        clon.querySelector('[data-title]').innerHTML = pc.title;
        clon.querySelector('[data-cpu]  ').innerHTML = pc.cpu;
        clon.querySelector('[data-mobo] ').innerHTML = pc.mobo;
        clon.querySelector('[data-gpu]  ').innerHTML = pc.gpu;
        clon.querySelector('[data-ssd]  ').innerHTML = pc.ssd;
        clon.querySelector('[data-ram]  ').innerHTML = pc.ram;
        clon.querySelector('[data-fan]  ').innerHTML = pc.fan;
        clon.querySelector('[data-case] ').innerHTML = pc.case;
        clon.querySelector('[data-price]').innerHTML = pc.price;
        
        card_container.appendChild(clon);
    })
}

const load_internal_comp = () => {
    category_state = 1;
    console.log("Loading Internal Component");
    let card_template  = document.getElementById('part_cards');
    let card_container = document.getElementById('cardContainer');
    document.getElementById('category_selected').innerText = 'Internal Parts';
    
    card_container.innerHTML = '';
    
    data_comp.internal_component_card.forEach(part => {
        let clon = card_template.content.cloneNode(true);
        
        const detailLink = `detail.html?category=internal-part&id=${part.id}`;
        clon.querySelector('[data-id]').setAttribute('href', detailLink);
        
        clon.querySelector('[data-image]').src        = part.img_dir;
        clon.querySelector('[data-title]').innerHTML  = part.title;
        clon.querySelector('[data-type]' ).innerHTML  = part.type;
        clon.querySelector('[data-price]').innerHTML  = part.price;
        
        card_container.appendChild(clon);
    })
}

const load_monitor = () => {
    category_state = 2;
    console.log("Loading Monitors");
    let card_template  = document.getElementById('monitor_cards');
    let card_container = document.getElementById('cardContainer');
    document.getElementById('category_selected').innerText = 'Monitor';
    
    card_container.innerHTML = '';
    
    data_monitor.monitor_card.forEach(moni => {
        let clon = card_template.content.cloneNode(true);
        
        const detailLink = `detail.html?category=monitor&id=${moni.id}`;
        clon.querySelector('[data-id]').setAttribute('href', detailLink);
        
        clon.querySelector('[data-image]').src             = moni.img_dir;
        clon.querySelector('[data-title]').innerHTML       = moni.title;
        clon.querySelector('[data-type]' ).innerHTML       = moni.type;
        clon.querySelector('[data-price]').innerHTML       = moni.price;
        
        card_container.appendChild(clon);
    })
}

const load_peripherals = () => {
    category_state = 3;
    console.log("Loading Peripherals");
    let card_template  = document.getElementById('peripherals_cards');
    let card_container = document.getElementById('cardContainer');
    document.getElementById('category_selected').innerText = 'Peripherals';
    
    card_container.innerHTML = '';
    
    data_peripherals.peripherals_card.forEach(items => {
        let clon = card_template.content.cloneNode(true);
        
        const detailLink = `detail.html?category=peripheral&id=${items.id}`;
        clon.querySelector('[data-id]').setAttribute('href', detailLink);
        
        clon.querySelector('[data-image]').src        = items.img_dir;
        clon.querySelector('[data-title]').innerHTML  = items.title;
        clon.querySelector('[data-type]' ).innerHTML  = items.type;
        clon.querySelector('[data-price]').innerHTML  = items.price;
        
        card_container.appendChild(clon);
    })
}

const cls = () => {
    console.log("Clearing Category");
    document.getElementById('cardContainer').innerHTML = '';
    document.getElementById('category_selected').innerText = 'Clearing';
}

// Fungsi untuk loading
const loading = (conditon) => {
    let load_screen = document.getElementById('loading_screen')
    const body = document.getElementsByTagName('body')[0];
    if (conditon){
        load_screen.classList.remove('hidden');
        body.classList.replace('overflow-auto', 'overflow-hidden')
    } else {
        load_screen.classList.add('hidden');
        body.classList.replace('overflow-hidden', 'overflow-auto')
    }
}

const load_header = () => {
    const head = document.getElementsByTagName('header')[0];
    head.classList.add('bg-neutral-950', 'h-16', 'w-full', 'flex', 'justify-between', 'items-center', 'pl-4', 'sm:pl-8', 'pr-4', 'py-4', 'inset-0', 'fixed', 'z-[9999]');
    
    head.innerHTML = `
        <p class="max-h-max text-3xl font-bold text-neutral-200">
            <a href="./index.html">HelloPC</a>
        </p>
        <div class="hidden sm:flex justify-end items-center h-full gap-4">
            <input 
                type="text" 
                placeholder="Search Here..." 
                class="text-neutral-400 flex justify-start items-center h-full pl-5 bg-gray-800/30 rounded-full focus:outline-1 focus:outline-gray-500 duration-500"
            >
            <svg width="30px" height="30px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                <circle cx="8" cy="6" r="3.25"/>
                <path d="m2.75 14.25c0-2.5 2-5 5.25-5s5.25 2.5 5.25 5"/>
            </svg>
        </div>
    `;
}

const load_footer = () => {
    const foot = document.getElementsByTagName('footer')[0];
    foot.classList.add('min-w-sm', 'w-full', 'px-7', 'sm:px-10', 'md:px-12', 'lg:px-20', 'justify-center', 'text-white', 'font-sans');
    foot.innerHTML = `
        <div class="flex flex-wrap items-start sm:flex-row justify-center gap-12 md:gap-20 lg:justify-between border-t-gray-500/50 border-t-2 py-10 sm:px-10 md:px-16 lg:px-40">
            <div class="flex flex-col w-fit justify-center items-center sm:items-start text-neutral-400 space-y-2">
                <h4 class="text-neutral-200 font-bold mb-2">Bantuan & Layanan</h4>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Hubungi Kami</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Cara Berbelanja</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Status Pesanan</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">FAQ</a>
            </div>
            <div class="flex flex-col w-fit justify-center items-center sm:items-start text-neutral-400 space-y-2">
                <h4 class="text-neutral-200 font-bold mb-2">Tentang Kami</h4>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Tentang PC Store</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Karir</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Kebijakan Privasi</a>
                <a href="#" class="hover:text-white hover:translate-x-1 transition-3">Syarat & Ketentuan</a>
            </div>
            <div class="flex flex-col w-fit justify-center items-center sm:items-start text-neutral-400 space-y-2">
                <h4 class="text-neutral-200 font-bold mb-2">Jelajahi</h4>
                <a href="./index.html" class="hover:text-white hover:translate-x-1 transition-3">Komponen PC</a>
                <a href="./index.html" class="hover:text-white hover:translate-x-1 transition-3">Laptop & Aksesoris</a>
                <a href="./index.html" class="hover:text-white hover:translate-x-1 transition-3">Periferal Gaming</a>
                <a href="./index.html" class="hover:text-white hover:translate-x-1 transition-3">Promo & Diskon</a>
            </div>
        </div>
    
        <!-- Copyright -->
        <div class="w-full px-10 sm:px-14 md:px-20 lg:px-72">
            <p class="text-center text-xs sm:text-sm md:text-md text-neutral-400 border-t-2 border-t-gray-500/50 py-4">© 2025 PC Store. All Rights Reserved.</p>
        </div>
    `;
}

const make_loading_screen = () => {
    const load_screen = document.getElementById('loading_screen');
    load_screen.classList.add('fixed', 'inset-0', 'h-screen', 'w-screen', 'bg-black/95', 'z-[9999]', 'hidden');

    load_screen.innerHTML = `
        <div class="w-full h-full flex justify-center items-center">
            <div class="loader"></div>
        </div>
    `;
}