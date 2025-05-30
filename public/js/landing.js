// JavaScript para funcionalidades adicionais
        
        // Efeito de rolagem suave para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        document.querySelector('.login-btn').href

        // Animação para os cards quando aparecem na tela
        const observerOptions = {
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        }, observerOptions);
        
        // Observar todos os elementos com a classe 'feature-card'
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
        
        // Adicionar classe de animação quando a página carrega
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });