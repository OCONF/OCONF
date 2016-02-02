var skynetChat = skynetChat || {
  $current_user: null,
  isOpen: false,
  chat_history: [],
  statuses: {
    online: {
      class: 'is-online',
      order: 1,
      label: 'Online',
    },
    offline: {
      class: 'is-offline',
      order: 4,
      label: 'Offline',
    },
    idle: {
      class: 'is-idle',
      order: 3,
      label: 'Idle',
    },
    busy: {
      class: 'is-busy',
      order: 2,
      label: 'Busy',
    },
  },
};

;(function($, window, undefined) {
  "use strict";

  var $chat = $("#chat"),
    $chat_inner = $chat.find('.chat-inner'),
    $chat_badge = $chat.find('.badge').add($('.chat-notifications-badge')),
    $conversation_window = $chat.find(".chat-conversation"),
    $conversation_header = $conversation_window.find(".conversation-header"),
    $conversation_body = $conversation_window.find('.conversation-body'),
    $textarea = $conversation_window.find('.chat-textarea textarea'),

    sidebar_default_is_open = !$(".page-container").hasClass('sidebar-collapsed');


  $.extend(skynetChat, {

    init: function() {
      // Implement Unique ID in case it doesn't exists
      if ($.isFunction($.fn.uniqueId) == false) {

        jQuery.fn.extend({

          uniqueId: (function() {
            var uuid = 0;

            return function() {
              return this.each(function() {
                if (!this.id) {
                  this.id = "ui-id-" + (++uuid);
                }
              });
            };
          })(),
        });
      }

      // Conversation Close
      $conversation_window.on('click', '.conversation-close', skynetChat.close);

      $("body").on('click', '.chat-close', function(ev) {
        ev.preventDefault();

        var animate = $(this).is('[data-animate]');

        skynetChat.hideChat(animate);
      });

      $("body").on('click', '.chat-open', function(ev) {
        ev.preventDefault();

        var animate = $(this).is('[data-animate]');

        skynetChat.showChat(animate);
      });


      // Texarea
      $textarea.keydown(function(e) {
        if (e.keyCode == 27) {
          skynetChat.close();
        }
      });


      $chat.on('click', '.chat-group a', function(ev) {
        ev.preventDefault();

        var $chat_user = $(this);

        if ($chat_user.hasClass('active')) {
          skynetChat.close();
        } else {
          skynetChat.open($chat_user);
        }
      });

      $chat.find('.chat-group a').each(function(i, el) {
        var $this = $(el);

        $this.append('<span class="badge badge-info is-hidden">0</span>');
      });

      skynetChat.refreshUserIds();
      skynetChat.orderGroups();
      skynetChat.prefetchMessages();
      skynetChat.countUnreadMessages();
      skynetChat.puffUnreads();

      // Chat
      if ($chat.hasClass('fixed') && $chat_inner.length && $.isFunction($.fn.niceScroll)) {
        $chat.find('.chat-inner').niceScroll({
          cursorcolor: '#454a54',
          cursorborder: '1px solid #454a54',
          railpadding: {
            right: 3
          },
          railalign: 'right',
          cursorborderradius: 1
        });
      }

      // Chat Toggle
      $("body").on('click', '[data-toggle="chat"]', function(ev) {
        ev.preventDefault();

        var $this = $(this),
          with_animation = $this.is('[data-animate]'),
          collapse_sidebar = $this.is('[data-collapse-sidebar]');

        skynetChat.toggleChat(with_animation, collapse_sidebar);
      });
    },

    open: function($user_link) {
      this.refreshUserIds();

      if (typeof $user_link == 'string') {
        $user_link = $($user_link);
      }

      // Set Active Class
      $chat.find('.chat-group a').not($user_link).removeClass('active');
      $user_link.addClass('active');

      // Chat Header
      var user_status = this.statuses[this.chat_history[$user_link.attr('id')].status];


      $conversation_header.find('.display-name').html($user_link.find('em').text());

      if (user_status) {
        $conversation_header.find('.user-status').attr('class', 'user-status ' + user_status.class);
        $conversation_header.find('small').html(user_status.label);
      }

      $conversation_window.show();
      $textarea.val('');

      this.updateScrollbars();
      this.updateConversationOffset($user_link);


      $textarea.focus();

      this.$current_user = $user_link;
      this.isOpen = true;

      this.puffUnreadsAll();
    },

    close: function() {
      $chat.find('.chat-group a').removeClass('active');

      $conversation_window.hide().css({
        top: 0,
        opacity: 0
      });

      $conversation_body.find('li.unread').removeClass('unread');

      this.$current_user = null;
      this.isOpen = false;

      return false;
    },

    updateScrollbars: function() {
      scrollToBottom('#chat .chat-conversation .conversation-body');
    },

    updateConversationOffset: function($el) {
      var top_h = $conversation_window.find('.conversation-body').position().top + 1,
        offset = $el.position().top - top_h,
        minus = 0,

        con_h = $conversation_window.height(),
        win_h = $(window).height();

      if ($chat.hasClass('fixed') && offset + con_h > win_h) {
        minus = offset + con_h - win_h;
      }

      if ($(".page-container.horizontal-menu").length) {
        minus += $(".page-container.horizontal-menu .navbar").height();
      }

      offset -= minus;

      $conversation_window.transition({
        top: offset,
        opacity: 1
      });

    },

    refreshUserIds: function() {
      $('#chat .chat-group a').each(function(i, el) {
        var $this = $(el),
          $status = $this.find('.user-status');

        $this.uniqueId();

        var id = $this.attr('id');

        if (typeof skynetChat.chat_history[id] == 'undefined') {
          var status = $this.data('status');

          if (!status) {
            for (var i in skynetChat.statuses) {
              if ($status.hasClass(skynetChat.statuses[i].class)) {
                status = i;
                break;
              }
            }
          }

          skynetChat.chat_history[id] = {
            $el: $this,
            messages: [],
            unreads: 0,
            status: status
          };
        }
      });

    },




    getStatus: function(id) {
      if (typeof id == 'object') {
        id = id.attr('id');
      }

      var user = skynetChat.chat_history[id];

      if (user) {
        return user.status;
      }

      return null;
    },

    setStatus: function(id, status) {
      var $user = typeof id == 'string' ? $('.chat-group a#' + id.replace('#', '')) : id;

      if ($user.$el) {
        $user = $user.$el;
      }

      if ($user.length && this.statuses[status].class) {
        var $status = $user.find('.user-status');

        for (var i in this.statuses) {
          $status.removeClass(this.statuses[i].class);
        }

        $status.addClass(this.statuses[status].class);
        $user.data('status', status);

        skynetChat.chat_history[$user.attr('id')].status = status;
        this.orderGroups();
      }
    },

    orderGroups: function() {
      var $groups = $chat.find('.chat-group');

      if (!$chat.data('order-by-status')) {
        return false;
      }

      $groups.each(function(i, el) {
        var $group = $(el),
          $contacts = $group.find('> a');

        $contacts.each(function(i, el) {
          var $contact = $(el),
            $status = $contact.find('.user-status');

          for (var i in skynetChat.statuses) {
            var status = skynetChat.statuses[i];

            if (i == $contact.data('status')) {
              $contact.data('order-id', status.order);
              return true;
            } else
            if ($status.hasClass(status.class)) {
              $contact.data('order-id', status.order);
              return true;
            }
          }
        });

        var $new_order = $contacts.sort(function(a, b) {
          return parseInt($(a).data('order-id'), 10) > parseInt($(b).data('order-id'), 10);
        }).appendTo($group);
      });

      return true;
    },

    prefetchMessages: function() {
      $chat.find('.chat-group a').each(function(i, el) {
        var $contact = $(el),
          id = $contact.attr('id'),
          history_container = $contact.data('conversation-history');

        if (history_container && history_container.length) {
          $($(history_container)).find('> li').each(function(j, el2) {
            var $entry = $(el2),
              from = $entry.find('.user').html(),
              message = $entry.find('p').html(),
              time = $entry.find('.time').html(),
              fromOpponent = $entry.hasClass('even') || $entry.hasClass('odd') || $entry.hasClass('opponent'),
              unread = $entry.hasClass('unread');

            skynetChat.pushMessage(id, message, from, time, fromOpponent, unread)
          });
        }

      });
    },

    countUnreadMessages: function(id) {
      var counter = 0;

      if (!id) {
        for (var id in skynetChat.chat_history) {
          var user = skynetChat.chat_history[id],
            current_user_count = 0;

          for (var i in user.messages) {
            if (user.messages[i].unread) {
              counter++;
              current_user_count++;
            }
          }

          user.unreads = current_user_count;
        }
      } else {
        if (typeof id == 'object') {
          id = id.attr('id');
        }

        var user = skynetChat.chat_history[id];

        if (user) {
          return user.unreads;
        }
      }

      return counter;
    },

    puffUnreads: function() {
      for (var i in this.chat_history) {
        var entry = skynetChat.chat_history[i],
          $badge = entry.$el.find('.badge');

        if (entry.unreads > 0) {
          $badge.html(entry.unreads).removeClass('is-hidden');
        } else {
          $badge.html(entry.unreads).addClass('is-hidden');
        }
      }
    },

    puffUnreadsAll: function() {
      var total_unreads = this.countUnreadMessages();

      $chat_badge.html(total_unreads);
      $chat_badge[total_unreads > 0 ? 'removeClass' : 'addClass']('is-hidden');
    },


    // Groups
    createGroup: function(name, prepend) {
      var $group = $('<div class="chat-group"><strong>' + name + '</strong></div>');

      if (prepend) {
        $group.insertBefore($chat.find('.chat-group:first'));
      } else {
        $group['appendTo']($chat);
      }

      $group.hide().slideDown();

      $group = $group.uniqueId();

      return $group.attr('id');
    },

    removeGroup: function(group_id, move_users_to_group) {
      var $group = $chat.find("#" + group_id.replace('#', '') + '.chat-group');

      if ($group.length) {
        if (move_users_to_group) {
          var $group_2 = $chat.find("#" + move_users_to_group.replace('#', '') + '.chat-group');

          if ($group_2.length) {
            $group.find('a').each(function(i, el) {
              var $user = $(el);

              $group_2.append($user);

              $user.hide().slideDown();
            });
          }

          this.orderGroups();
        }

        $group.slideUp(function() {
          $group.remove();
        });
      }
    },

    addUser: function(group_id, display_name, status, prepend, user_id) {
      var $group = group_id;

      if (typeof group_id == 'string') {
        $group = $chat.find("#" + group_id.replace('#', '') + '.chat-group');
      }

      if ($group && $group.length) {
        var status = this.statuses[status],
          $user = $('<a href="#"><span class="user-status ' + status.class + '"></span> <em>' + display_name + '</em> <span class="badge badge-info is-hidden>0</span></a>');

        if (user_id) {
          $user.attr('id', user_id);
        }

        if (prepend) {
          $user.insertAfter($group.find('> strong'));
        } else {
          $user['appendTo']($group);
        }

        $user.hide().slideDown();

        this.refreshUserIds();
        this.orderGroups();

        return $user.uniqueId().attr('id');
      }

      return null;
    },

    addUserId: function(group_id, user_id, display_name, status, prepend) {
      return this.addUser(group_id, display_name, status, prepend, user_id);
    },

    getUser: function(id) {
      return this.chat_history[id] ? this.chat_history[id] : null;
    },

    moveUser: function(user_id, new_group_id, prepend) {
      var $new_group = $chat.find("#" + new_group_id.replace('#', '') + '.chat-group'),
        user = this.chat_history[user_id];


      if ($new_group.length && user) {
        if (prepend) {
          user.$el.insertAfter($new_group.find('> strong'));
        } else {
          user.$el['appendTo']($new_group);
        }

        this.orderGroups();

        return true;
      }

      return false;
    },

    // Chat Container
    showChat: function(animated) {
      var visible_class = 'chat-visible';

      if (isxs()) {
        visible_class += ' toggle-click';
      }

      if (animated) {
        if ($chat.data('is-busy') || public_vars.$pageContainer.hasClass(visible_class)) {
          return false;
        }

        $chat.data('is-busy', true);

        var isLeft = public_vars.$pageContainer.hasClass('right-sidebar') ? -1 : 1;

        public_vars.$pageContainer.addClass(visible_class);

        TweenMax.from($chat, 0.3, {
          opacity: 0,
          x: isLeft * 100,
          ease: Sine.easeInOut,
          onComplete: function() {
            $chat.data('is-busy', false).removeAttr('style');
          }
        });
      } else {
        public_vars.$pageContainer.addClass(visible_class);
      }
    },

    hideChat: function(animated) {
      var visible_class = 'chat-visible';


      if (isxs()) {
        visible_class += ' toggle-click';
      }

      if (animated) {
        if ($chat.data('is-busy') || public_vars.$pageContainer.hasClass(visible_class) == false) {
          return false;
        }

        $chat.data('is-busy', true);

        var isLeft = public_vars.$pageContainer.hasClass('right-sidebar') ? -1 : 1;

        TweenMax.to($chat, 0.3, {
          opacity: 0,
          x: isLeft * 100,
          ease: Sine.easeInOut,
          onComplete: function() {
            $chat.data('is-busy', false).removeAttr('style');
            public_vars.$pageContainer.removeClass(visible_class);
          }
        });


      } else {
        public_vars.$pageContainer.removeClass(visible_class);
      }
    },

    toggleChat: function(animated, collapse_sidebar) {
      var _func = public_vars.$pageContainer.hasClass('chat-visible') ? 'hideChat' : 'showChat';

      if (isxs()) {
        _func = public_vars.$pageContainer.hasClass('toggle-click') ? 'hideChat' : 'showChat';
      }

      skynetChat[_func](animated);

      if (collapse_sidebar) {
        if (sidebar_default_is_open) {
          if (_func == 'hideChat') // Hide Sidebar
          {
            show_sidebar_menu(animated);
          } else {
            hide_sidebar_menu(animated);
          }
        }
      }
    }
  });


  // Set Cursor
  $conversation_body.on('click', function() {
    $textarea.focus();
  });


  // Refresh Ids
  skynetChat.init();

})(jQuery, window);
