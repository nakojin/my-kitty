	</main>
	<div class="disclosure">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
	<nav class="tabbar" id="tabbar" aria-label="주요 메뉴">
		<?php
		$tabs = [
			[ home_url( '/' ), '홈', '⌂', is_front_page() || is_tax( 'world' ) ],
			[ home_url( '/ranking/newera-kr/' ), '랭킹', '▲', is_tax( 'ranking_board' ) ],
			[ home_url( '/collection/' ), '도감', '▦', is_page( 'collection' ) ],
			[ home_url( '/my/' ), '마이', '◉', is_page( 'my' ) ],
		];
		foreach ( $tabs as [ $url, $label, $icon, $on ] ) {
			printf( '<a href="%s" class="%s"><span class="ico">%s</span>%s</a>', esc_url( $url ), $on ? 'on' : '', $icon, esc_html( $label ) );
		}
		?>
	</nav>
	<div class="sheet-wrap" id="sheet"><div class="dim"></div><div class="sheet"><div class="handle"></div><div id="sheet-inner" style="display:contents"></div></div></div>
</div>
<?php wp_footer(); ?>
</body>
</html>
