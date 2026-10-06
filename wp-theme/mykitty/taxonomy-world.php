<?php
/**
 * 월드 (S3). /world/{slug}/?tab=cur|chars|all&rarity=common&char=탄지로
 * 프로토타입 V.world 와 같은 구조: 테마 헤더 → 탭 → 큐레이션 / 캐릭터 / 전체.
 */
get_header();

$world  = get_queried_object();
$wid    = $world->term_id;
$tab    = in_array( $_GET['tab'] ?? '', [ 'cur', 'chars', 'all' ], true ) ? $_GET['tab'] : 'cur';
$rarity = sanitize_key( $_GET['rarity'] ?? '' );
$char   = sanitize_text_field( wp_unslash( $_GET['char'] ?? '' ) );
$chars  = array_values( array_filter( array_map( 'trim', explode( ',', (string) get_term_meta( $wid, 'characters', true ) ) ) ) );
$no     = (int) get_term_meta( $wid, 'world_no', true );
$base   = mykitty_term_url( $world );
$rmap   = mykitty_rarity_map();

// 이 월드의 피규어 전부 (클라이언트 집계와 캐릭터 카운트에 재사용)
$all = get_posts( [ 'post_type' => 'figure', 'posts_per_page' => -1, 'tax_query' => [ [ 'taxonomy' => 'world', 'field' => 'term_id', 'terms' => $wid ] ], 'orderby' => 'menu_order title', 'order' => 'ASC' ] );
$by_rarity = fn( string $r ) => array_values( array_filter( $all, fn( $p ) => mykitty_rarity_key( get_post_meta( $p->ID, 'rarity', true ) ) === $r ) );
$curation  = (int) get_term_meta( $wid, 'curation_post', true );
?>
<div class="view" style="<?php echo mykitty_world_style( $world ); ?>">
	<div class="hero">
		<?php mykitty_img_slot( get_term_meta( $wid, 'hero_slot', true ), '', '', ' ' ); ?>
		<div class="splat" style="width:130px;height:130px;right:-50px;top:-50px"></div>
		<div class="splat ink" style="width:9px;height:9px;right:96px;top:28px"></div>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="small" style="color:var(--fg);opacity:.8">‹ 홈</a>
		<div class="label" style="color:var(--fg);opacity:.7;margin-top:8px">WORLD <?php echo str_pad( $no, 2, '0', STR_PAD_LEFT ); ?></div>
		<h1 class="display" style="font-size:36px;margin:0"><?php echo esc_html( $world->name ); ?></h1>
		<div class="stroke" style="width:150px;margin-top:8px"></div>
		<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px">
			<span class="muted small">피규어 <?php echo count( $all ); ?>종 · 캐릭터 <?php echo count( $chars ); ?>명</span>
			<span class="display" style="font-size:20px">도감 <span style="color:var(--theme)" data-completion="<?php echo esc_attr( $world->slug ); ?>">0%</span></span>
		</div>
	</div>

	<div class="pad" style="display:flex;flex-direction:column;gap:14px">
		<nav class="segtabs">
			<a class="<?php echo $tab === 'cur' ? 'on' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'tab', 'cur', $base ) ); ?>">큐레이션</a>
			<a class="<?php echo $tab === 'chars' ? 'on' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'tab', 'chars', $base ) ); ?>">캐릭터</a>
			<a class="<?php echo $tab === 'all' ? 'on' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'tab', 'all', $base ) ); ?>">전체 <?php echo count( $all ); ?></a>
		</nav>

		<?php if ( $tab === 'cur' ) : ?>

			<?php if ( $curation && get_post_status( $curation ) === 'publish' ) : ?>
				<a class="panel" href="<?php echo esc_url( get_permalink( $curation ) ); ?>" style="display:flex;gap:12px;align-items:center">
					<div style="width:64px;height:84px;flex:none"><?php mykitty_img_slot( 'IMG-POST-' . $world->slug, '', get_the_post_thumbnail_url( $curation, 'mk-poster' ) ?: '', 'TOP 5<br>표지' ); ?></div>
					<div style="flex:1"><div class="label">큐레이션 · 블로그</div><div class="t"><?php echo esc_html( get_the_title( $curation ) ); ?></div><div class="muted small"><?php echo esc_html( wp_trim_words( get_the_excerpt( $curation ), 14 ) ); ?></div></div>
					<span class="muted">›</span>
				</a>
			<?php else : ?>
				<div class="panel flat muted small">큐레이션 글 준비 중</div>
			<?php endif; ?>

			<?php $c = array_slice( $by_rarity( 'common' ), 0, 3 ); if ( $c ) : ?>
				<section><div class="label" style="margin-bottom:6px">입문 추천 · <?php echo esc_html( $rmap['common']['hint'] ); ?></div>
				<div class="grid3"><?php foreach ( $c as $p ) { mykitty_figure_card( $p->ID ); } ?></div></section>
			<?php endif; ?>

			<?php $hi = array_slice( array_merge( $by_rarity( 'rare' ), $by_rarity( 'epic' ), $by_rarity( 'legendary' ) ), 0, 3 ); if ( $hi ) : ?>
				<section><div class="label" style="margin-bottom:6px">소장용 · 레어 이상</div>
				<div class="grid3"><?php foreach ( $hi as $p ) { mykitty_figure_card( $p->ID ); } ?></div></section>
			<?php endif; ?>

			<?php if ( ! $all ) : ?><div class="panel flat muted small">이 월드에 등록된 피규어가 아직 없어요.</div><?php endif; ?>

		<?php elseif ( $tab === 'chars' ) : ?>

			<div class="grid3" style="gap:14px 8px">
			<?php foreach ( $chars as $i => $ch ) :
				$of  = array_values( array_filter( $all, fn( $p ) => get_post_meta( $p->ID, 'character', true ) === $ch ) );
				$ids = array_map( fn( $p ) => $p->post_name, $of ); ?>
				<a href="<?php echo esc_url( add_query_arg( [ 'tab' => 'all', 'char' => $ch ], $base ) ); ?>" style="text-align:center" data-char-ring="<?php echo esc_attr( implode( ',', $ids ) ); ?>" data-alt="<?php echo $i === 1 ? 't2' : 't'; ?>">
					<div class="charring off"><?php echo esc_html( $ch ); ?></div>
					<div class="muted" style="font-size:10px;margin-top:4px"><?php echo count( $of ); ?>종 · <span data-own-count>0</span> 보유</div>
				</a>
			<?php endforeach; ?>
			</div>

		<?php else : ?>

			<div class="chips">
				<?php mykitty_chip( '전체', ! $rarity && ! $char, '', add_query_arg( 'tab', 'all', $base ) ); ?>
				<?php foreach ( $rmap as $k => $r ) { mykitty_chip( $r['label'], $rarity === $k, 'r-' . $k, add_query_arg( [ 'tab' => 'all', 'rarity' => $k ], $base ) ); } ?>
				<?php if ( $char ) { mykitty_chip( $char . ' ✕', true, '', add_query_arg( 'tab', 'all', $base ) ); } ?>
			</div>
			<?php
			$list = array_values( array_filter( $all, function ( $p ) use ( $rarity, $char ) {
				if ( $rarity && mykitty_rarity_key( get_post_meta( $p->ID, 'rarity', true ) ) !== $rarity ) { return false; }
				if ( $char && get_post_meta( $p->ID, 'character', true ) !== $char ) { return false; }
				return true;
			} ) );
			?>
			<?php if ( $list ) : ?>
				<div class="grid3"><?php foreach ( $list as $p ) { mykitty_figure_card( $p->ID ); } ?></div>
			<?php else : ?>
				<div class="muted small" style="padding:20px;text-align:center">해당하는 피규어가 없어요</div>
			<?php endif; ?>

		<?php endif; ?>
	</div>
</div>
<?php get_footer(); ?>
