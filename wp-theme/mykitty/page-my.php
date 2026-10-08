<?php
/**
 * Template Name: 마이
 * 마이 (S7). 거의 전부 클라이언트 상태. 서버는 틀·뱃지 목록·퀘스트 정의만.
 */
get_header();
$badges = [ 'first-coll' => '첫 도감', 'streak-7' => '7일', 'starter' => '입문자', 'kny-10' => '귀멸 10', 'half' => '완주 50%', 'gacha-3' => '뽑기 3일' ];
$quests = [ 'checkin' => [ '데일리 체크인', '+10 XP' ], 'gacha' => [ '오늘의 뽑기 열기', '+10 XP' ], 'coll' => [ '도감에 1개 담기', '+20 XP' ], 'half' => [ '월드 하나 50% 달성', '뱃지' ] ];
?>
<div class="view pad" data-screen="my" style="display:flex;flex-direction:column;gap:14px;position:relative">
	<div class="splat ink" style="width:70px;height:70px;left:-30px;top:60px;opacity:.12"></div>

	<div style="display:flex;gap:12px;align-items:center">
		<div class="charring" style="width:64px;height:64px;margin:0;overflow:hidden"><?php mykitty_img_slot( 'IMG-AVATAR', '', is_user_logged_in() ? get_avatar_url( get_current_user_id(), [ 'size' => 128 ] ) : '', ' ' ); ?></div>
		<div style="flex:1">
			<div class="t" style="font-size:16px" data-nick><?php echo is_user_logged_in() ? esc_html( wp_get_current_user()->display_name ) : '컬렉터'; ?></div>
			<div style="display:flex;align-items:baseline;gap:8px"><span class="display" style="font-size:30px;color:var(--theme)">Lv <span data-level>1</span></span><span class="muted small">다음 레벨까지 <span data-xp-left>200</span> XP</span></div>
			<div class="xp" style="margin-top:4px"><i data-xp-bar style="--w:0%"></i></div>
		</div>
	</div>

	<div class="grid3">
		<div class="panel" style="text-align:center"><div class="display" style="font-size:22px" data-streak>0</div><div class="label">연속 체크인</div></div>
		<div class="panel" style="text-align:center"><div class="display" style="font-size:22px" data-own-total>0</div><div class="label">보유 피규어</div></div>
		<div class="panel" style="text-align:center"><div class="display" style="font-size:22px" data-world-total>0</div><div class="label">월드</div></div>
	</div>

	<section>
		<div class="label">뱃지 <span class="muted" data-badge-count>0/<?php echo count( $badges ); ?></span></div>
		<div style="display:flex;gap:10px;margin-top:8px;overflow-x:auto">
			<?php foreach ( $badges as $id => $name ) : ?><div class="gem" data-badge="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $name ); ?></div><?php endforeach; ?>
		</div>
	</section>

	<section class="panel flat">
		<div class="label">오늘의 퀘스트</div>
		<?php foreach ( $quests as $id => [ $label, $reward ] ) : ?>
			<div class="row" data-quest="<?php echo esc_attr( $id ); ?>"><span style="flex:1"><i data-quest-mark><?php echo mykitty_icon( 'circle' ); ?></i> <?php echo esc_html( $label ); ?></span><span class="muted small"><?php echo esc_html( $reward ); ?></span></div>
		<?php endforeach; ?>
	</section>

	<?php if ( is_user_logged_in() ) : ?>
		<div class="panel flat small"><span class="muted">로그인 상태 · 도감이 계정에 동기화됩니다.</span> <a href="<?php echo esc_url( wp_logout_url( home_url( '/my/' ) ) ); ?>" style="color:var(--theme)">로그아웃</a></div>
	<?php else : ?>
		<div class="panel flat small"><span class="muted">지금은 이 기기에만 저장돼요.</span> <a href="<?php echo esc_url( wp_login_url( home_url( '/my/' ) ) ); ?>" style="color:var(--theme)">로그인하면 다른 기기에서도 이어집니다</a></div>
	<?php endif; ?>

	<div class="muted small" style="display:flex;gap:14px;flex-wrap:wrap">
		<a href="<?php echo esc_url( home_url( '/onboarding/' ) ); ?>">월드 다시 고르기</a>
		<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">소개·제휴 고지</a>
		<button type="button" data-reset style="color:#a55">데이터 초기화</button>
	</div>
</div>
<?php get_footer(); ?>
